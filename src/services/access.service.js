'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getIntoData } = require('../utils')
const { ForbiddenRequestError, BadRequestError, UnauthorizedRequestError } = require('../core/error.response')
const { findByEmail, createShop } = require('./shop.service')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  /*
  1 - check email in db
  2 - match password
  3 - create AT vs RT and save
  4 - generate tokens
  5 - get data return login
  */
  static signIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError(' Shop not registerd');
    }

    const matchPassword = bcrypt.compare(password, foundShop.password)
    if (!matchPassword) {
      throw new UnauthorizedRequestError('Authenticationn Error')
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    })

    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId
    })

    return {
      shop: getIntoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    // try {
    console.log("name", name);
    const holderShop = await findByEmail({ email })

    if (holderShop) {
      throw new ForbiddenRequestError('Error: Shop allready registered');
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await createShop({
      name, email, password: passwordHash, roles: [RoleShop.SHOP]
    })

    if (newShop) {
      // created privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
      })
      // public key cryptoGraphy standards



      console.log({ privateKey, publicKey }); // save collection KeyStore

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey
      })

      if (!publicKeyString) {
        throw new ForbiddenRequestError('Error: publicKeyString error');
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString)
      //create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey)

      console.log(`create Token success::`, tokens)

      return {
        code: 201,
        metadata: {
          shop: getIntoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
          tokens
        }
      }

      // const tokens = await
    }
    return {
      code: 200,
      metadata: null
    }

    // } catch (error) {
    //   return {
    //     code: 500,
    //     message: error.message,
    //     status: 'error'
    //   }
    // }
  }

  static singout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeById(keyStore._id)
    console.log({ delKey });
    return delKey
  }

  /* 
    check this token used?
  */
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    if (foundToken) {
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
      console.log({ userId, email });
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenRequestError(' Something went wrong !! please relogin')
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new UnauthorizedRequestError('Shop not registered')

    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new UnauthorizedRequestError('Shop not registered')

    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })
    return {
      userId: { userId, email },
      tokens
    }
  }


}

module.exports = AccessService