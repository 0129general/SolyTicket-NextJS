import { ConfigHelper } from "../constants";
import { ClientStorage } from "../storage";

export function getToken(): string {
  return ClientStorage.getItem(ConfigHelper.SOLY_USER_TOKEN);
}

// export function getRefreshToken(): string {
//   return ClientStorage.getItem(ConfigHelper.COSMORATE_USER_REFRESH_TOKEN)
// }

export function getTokenCreatedTime() {
  return Number(
    ClientStorage.getItem(ConfigHelper.SOLY_USER_TOKEN_CREATE_TIME)
  );
}

// export function getUserId() {
//   if (!ClientStorage.hasItem(ConfigHelper.COSMORATE_USER_DATA)) {
//     return -1
//   }

//   return Number(
//     JSON.parse(ClientStorage.getItem(ConfigHelper.COSMORATE_USER_DATA)).UserId
//   )
// }

export function isRefreshTime(): boolean {
  const tokenMiliseconds: number = getTokenCreatedTime();
  const toDayMiliseconds: number = new Date().getTime();
  const difMinutes: number = (toDayMiliseconds - tokenMiliseconds) / 60000;

  return difMinutes >= 1440;
}
