import { ClientProxy } from "../base/proxy/clientProxy";
import { IRequesterInfo } from "../base/models";
import { ApiResponse } from "../base/models/common-models";

export class AuthApi extends ClientProxy {
  constructor(requesterInfo: IRequesterInfo) {
    super({
      url: "Authentication",
      requesterInfo,
    });
  }

  public async createAccount(
    data: CreateAccountModels
  ): Promise<ApiResponse<CreateAccountResponse>> {
    this.props.url = "users/signup-keycloack";
    return await this.postAsync<ApiResponse<CreateAccountResponse>>(data);
  }

  public async createOrg(
    name: string,
    email: string,
    phone: string,
    birthday: string,
    password: string,
    companyType: string,
    imzaSirkusu: string,
    vergiLevha: string,
    ticaretSicilGazetesi: string,
    tcFotokopi: string,
    imzaBeyannamesi: string,
    companyAddress: string,
    companyPhone: string,
    bankAccount: string,
    bankBranch: string,
    iban: string,
    accountName: string,
    accountantEmail: string
  ): Promise<ApiResponse<CreateAccountResponse>> {
    this.props.url = "users/signup-org";
    return await this.postAsync<ApiResponse<CreateAccountResponse>>({
      name,
      email,
      phone,
      birthday,
      password,
      companyType,
      imzaSirkusu,
      vergiLevha,
      ticaretSicilGazetesi,
      tcFotokopi,
      imzaBeyannamesi,
      companyAddress,
      companyPhone,
      bankAccount,
      bankBranch,
      iban,
      accountName,
      accountantEmail,
    });
  }

  public async login(
    data: LoginModel
  ): Promise<ApiResponse<CreateAccountResponse>> {
    this.props.url = "users/login";
    return await this.postAsync<ApiResponse<CreateAccountResponse>>(data);
  }

  public async logout(token: string): Promise<ApiResponse<any>> {
    this.props.url = "users/logout";
    return await this.postAsync<ApiResponse<any>>({ token });
  }

  public async verifyAccount(
    userId: string,
    code: string,
    password: string
  ): Promise<ApiResponse<verifyResponse>> {
    this.props.url = "users/verify";
    return await this.postAsync<ApiResponse<verifyResponse>>({
      userId,
      code,
      password,
    });
  }

  public async requestPasswordReset(
    email: string
  ): Promise<ApiResponse<resetPassRequestResponse>> {
    this.props.url = "users/request-password-reset";
    return await this.postAsync<ApiResponse<resetPassRequestResponse>>({
      email,
    });
  }

  public async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<ApiResponse<CreateAccountResponse>> {
    this.props.url = "users/reset-password";
    return await this.postAsync<ApiResponse<CreateAccountResponse>>({
      email,
      token,
      newPassword,
    });
  }

  public async getUserInfo(userId: string): Promise<userInfo> {
    this.props.url = `users/${userId}`;
    return await this.getAsync<userInfo>();
  }

  public async updateUserInfo(
    userId: string,
    userInfo: any
  ): Promise<ApiResponse<any>> {
    this.props.url = `users`;
    return await this.putAsync<ApiResponse<any>>(userId, userInfo);
  }

  public async getOrganizerStatistics(
    userId: string
  ): Promise<ApiResponse<any>> {
    this.props.url = `users/get-organizer-statistics?userId=${userId}`;
    return await this.getAsync<ApiResponse<any>>();
  }
}
