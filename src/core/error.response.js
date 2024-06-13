'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503,
}

const ReasonStatusCode = {
    FORBIDDEN: "forbidden error",
    CONFLICT: "conflict error",
    BAD_REQUEST: "bad request error",
    UNAUTHORIZED: "unauthorized error",
    NOT_FOUND: "not found error",
    INTERNAL_SERVER_ERROR: "internal server error",
    NOT_IMPLEMENTED: "not implemented error",
    SERVICE_UNAVAILABLE: "service unavailable error",
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }

}

class ConflicRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode)
    }
}

class UnauthorizedRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflicRequestError,
    ForbiddenRequestError,
    BadRequestError,
    UnauthorizedRequestError,
    NotFoundRequestError
}