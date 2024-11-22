export enum RequesterChannel {
  Web = "web",
  Mobile = "mobile"
}

export enum RequesterPlatform {
  Ios = "ios",
  Android = "android"
}

export interface IException {
  httpStatusCode?: number;
  isTokenExpired?: boolean;
  code: string;
  description: string;
  reason?: string;
}

export interface IRequesterInfo {
  screenCode?: string;
  username?: string;
  apiAccessDataType?: string;
  clientChannel?: RequesterChannel;
  clientPlatform?: RequesterPlatform;
  token?: string;
  returnUrlOnRedirectLogin?: string;
}

export interface IClientProxyProps {
  url: string;
  hasFullUrl?: boolean;
  requesterInfo?: IRequesterInfo;
}

export interface IAuthRequest {
  AccountCode: string;
  UserName: string;
  Password: string;
}

export interface IAuthenticationResponse {
  UserId: number;
  Name: string;
  UserName: string;
  IsAdmin: boolean;
  Token: string;
  RefreshToken: string;
  CreatedTokenTime: number;
  HasChangePassword: boolean;
  ExceptionMessage: string;
  BeHalfOfToken: string;
  BeHalfOfUserId: string;
}