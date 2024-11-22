export enum UserRoleEnum {
  Admin = "Admin",
  Customer = "Customer",
  Organizer = "Organizer",
}

export interface IUserContext {
  id: string;
  role: UserRoleEnum;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  date: Date;
  message?: string;
  data?: T;
}
