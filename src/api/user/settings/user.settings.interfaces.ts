export interface IChangeReq {
  newEmail: string;
  newPassword: string;
  newUsername: string;
  newBio: string;
  password?: string;
  userId: string;
}

export interface IDeleteReq {
  userId: string;
}

export interface IUserSettingsResponse {
  success: boolean;
  errors: string;
}

export class UserSettingsResponse {
  constructor(public success: boolean, public errors: string) {}
}
