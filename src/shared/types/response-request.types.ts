export type ResponseError = {
    success: false,
    error: {
        details: unknown,
    },
    data?: never
}

export type ResponseSuccess<T = unknown> = {
    success: true,
    data: T;
    error?: never
}

export type ResponseBase = {

}

export type ResponseResult<T = unknown> = (ResponseSuccess<T> | ResponseError) & ResponseBase