'use strict'

class KeyTokenService {

    static createKeyToken = async ({user, publicKey}) => {
        try {
            const publicKeyString = publicKey.toString()
            
        } catch (error) {
            return error
        }
    }

}


module.exports = KeyTokenService