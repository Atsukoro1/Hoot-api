export interface ICreateReq {
    author: string
    textContent: string
    isReplyTo: string
    userId: string
    hashtags: Array<string>
};

export interface IDeleteReq {
    id: string
    userId: string
};

export interface ISearchReq {
    query: string,
    userId: string,
    page?: number
}

export interface IGetReq {
    id: string
    userId: string
}

export interface IEditReq {
    textContent: string
    hashtags: Array<string>,
    id: string
    userId: string
};

export interface IReactReq {
    id: string
    userId: string
};

export interface IDeleteReactionReq {
    id: string
    userId: string
};

export interface IHootResponse {
    success: boolean
    errors?: string,
    data?: object
}

export class HootResponse {
    constructor(
        public success: boolean,
        public errors: string,
        public data: object
    ) {};
}