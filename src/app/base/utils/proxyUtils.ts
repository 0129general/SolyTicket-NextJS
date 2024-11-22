import { ConfigHelper } from "../constants";
import { IException } from "../models";
import { ClientStorage } from "../storage";

export const handleException = (exception: any): IException => {
  if (exception.message === "Network Error") {
    return {
      code: "network_error",
      description: "There was a network error.",
    };
  }
  if (exception.response !== undefined) {
    if (exception.response.status > 399 && exception.response.status < 500) {
      if (exception.response.status === 404) {
        const res: IException = {
          code: "not_found",
          description: "Api not found!",
          isTokenExpired: false,
          httpStatusCode: exception.response.status,
        };

        return res;
      }

      // if (exception.response.status === 401) {
      //   if (exception.response.data) {
      //     return {
      //       code: "unauthorized_access",
      //       description: exception.response.data.Message,
      //       httpStatusCode: exception.response.data.Code,
      //     };
      //   }

      //   return {
      //     code: "unauthorized_access",
      //     description: "You are not authorized for this request!",
      //     httpStatusCode: exception.response.status,
      //   } as IException;
      // }

      if (exception.response.status === 403) {
        const res: IException = {
          code: "forbidden_access",
          description: "You are not authorized for this request!",
          httpStatusCode: exception.response.status,
          reason: exception.response.data?.Reason,
        };

        return res;
      }

      if (exception.response.status === 401) {
        const res: IException = {
          code: "unauthorized_access",
          description: exception.response.statusText,
          httpStatusCode: exception.response.status,
          reason: exception.response.data?.Reason,
        };

        return res;
      }

      if (!exception.response.data) {
        const res: IException = {
          code: "",
          description: "",
          isTokenExpired: false,
          httpStatusCode: exception.response.status,
        };

        return res;
      }

      const response: IException = {
        code: exception?.response?.data?.Message,
        description: exception?.response?.data?.Message,
        httpStatusCode: exception.response.status,
        isTokenExpired: false,
      };

      return response;
    }

    if (exception.response.status > 499) {
      return {
        code: "internal_server_error",
        description: "There was an unexpected error.",
      };
    }
  }

  return exception;
};

export const encrypt = (password: string): string => {
  let keyStr: string =
    "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";

  password = password.split("+").join("|");
  //let input = escape(password);
  /* let input = password; */
  let input = encodeURI(password);
  let output = "";
  let chr1: string | number, chr2: string | number, chr3: string | number;
  let enc1: string | number,
    enc2: string | number,
    enc3: string | number,
    enc4: string | number;
  let i = 0;

  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);

    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);

  return output;
};

export const clearLoginStorage = () => {
  ClientStorage.removeAll();
  // ClientStorage.removeItem(ConfigHelper.COSMORATE_USER_REFRESH_TOKEN);
  // ClientStorage.removeItem(ConfigHelper.COSMORATE_USER_TOKEN_CREATE_TIME);
  // ClientStorage.removeItem(ConfigHelper.COSMORATE_USER_DATA);
  // ClientStorage.removeItem(ConfigHelper.COSMORATE_IS_GET_TO_KNOW);
};
