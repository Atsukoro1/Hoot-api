export interface IFeedFetchRequest {
    page?: number
    limit?: number
    userId: string
}

export interface IMeFetchRequest {
    userId: string
}

export interface IMeResponse {
    success: boolean,
    error?: string,
    data?: object
}

export interface IFetchBookmarksReq {
    userId: string,
    page?: number
}

export interface IAddBookmarkReq {
    userId: string,
    id: string
}

export interface IRemoveBookmarkReq {
    userId: string,
    id: string
};

export class MeResponse {
    constructor(
        public success: boolean,
        public error: string,
        public data: object
    ) {};
}