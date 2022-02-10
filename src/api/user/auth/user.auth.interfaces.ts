export interface IRegisterReq {
    username: string;
    email: string;
    password: string;
    ua: string;
}

export interface ILoginReq {
    email: string;
    password: string;
}

export interface IUserAuthResponse {
    success: boolean,
    errors: string
    data: object
}

export class UserAuthResponse {
    constructor(
        public success: boolean,
        public errors: string,
        public data: object
    ) {};
} 