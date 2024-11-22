import { ConfigHelper } from "../constants";
import { IAuthRequest } from "../models/proxyModels";
import { ClientStorage } from "../storage";
import { handleException } from "../utils";
import { ServiceRouter } from "./serviceRouter";
import { clearLoginStorage, encrypt } from "../utils/proxyUtils";
import { getToken } from "./helper";
import axios from "axios";
import Swal from "sweetalert2";

function getAuthenticationRequest(
  accountCode: string,
  userName: string,
  password: string
): IAuthRequest {
  const authenticationRequest: IAuthRequest = {
    AccountCode: accountCode,
    UserName: userName,
    Password: password,
  };

  return authenticationRequest;
}

export function isLoggedIn() {
  return !!ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);
}

export async function authenticate(
  accountCode: string,
  username: string,
  password: string
): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      delete axios.defaults.headers.common.Authorization;
      axios.defaults.headers.common["Content-Type"] =
        "application/json; charset=utf-8";

      const result = await axios.post<any>(
        ServiceRouter.getAuthenticateUrl(),
        getAuthenticationRequest(accountCode, username, encrypt(password))
      );

      if (result?.data?.Success) {
        // ClientStorage.setItem(ConfigHelper.COSMORATE_USER_TOKEN, result.data.Token);
        // ClientStorage.setItem(ConfigHelper.COSMORATE_USER_REFRESH_TOKEN, result.data.RefreshToken);
        // ClientStorage.setItem(ConfigHelper.COSMORATE_USER_TOKEN_CREATE_TIME, result.data.CreatedTokenTime.toString());
        // ClientStorage.setItem(ConfigHelper.COSMORATE_USER_DATA, JSON.stringify(result.data));

        return resolve(true);
      }

      Swal.fire({
        // position: 'top-end',
        icon: "error",
        title: result?.data?.Message || "Hata",
        showConfirmButton: true,
        allowOutsideClick: true,
        backdrop: "rgba(255,255,255,.4)",
        // timer: 1500
      });

      return resolve(false);
    } catch (error) {
      reject(handleException(error));
    }
  });
}

export async function logoutUser(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      delete axios.defaults.headers.common.Authorization;
      axios.defaults.headers.common["Content-Type"] =
        "application/json; charset=utf-8";

      axios.defaults.headers["Content-Type"] =
        "application/json; charset=utf-8";
      axios.defaults.headers.common.Authorization = `Bearer ${getToken()}`;

      await axios.post<any>(ServiceRouter.getLogoutUrl());
    } catch (error) {
    } finally {
      resolve();

      redirectUserToHomepage();
    }
  });
}

const clearGoogleLogin = async () => {
  const { gapi } = await import("gapi-script");
  const auth2 = gapi.auth2;

  if (auth2) {
    try {
      const currentUser = await auth2.getAuthInstance().currentUser.get();

      if (currentUser.isSignedIn()) {
        await auth2.signOut();
        console.log("User signed out");
      } else {
        console.error("No user is currently signed in");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  } else {
    console.error("auth2 object not found");
  }
};

export async function redirectUserToHomepage() {
  clearLoginStorage();

  await clearGoogleLogin();

  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
