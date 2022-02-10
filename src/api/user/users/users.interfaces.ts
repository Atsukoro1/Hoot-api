export interface IUsersResponse {
    success: boolean
    errors?: string,
    data?: object
}

export class UsersResponse {
    constructor(
        public success: boolean,
        public errors: string,
        public data: object
    ) {};
}

export interface ISearchRequest {
    page?: number
    userId: string
    query: string
}

export interface IProfileRequest {
    page?: number
    id: string
    userId: string
}