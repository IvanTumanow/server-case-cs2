export type ResponseError = {
    success: false,
    error: {
        message: string,
    }
}

export type ResponseSuccess<T = unknown> = {
    success: true,
    data: T;
}

export type ResponseBase = {

}

export type ResponseResult<T = unknown> = (ResponseSuccess<T> | ResponseError) & ResponseBase