import { ServiceCallTypeEnum, IClientProxyProps } from "../models";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { getServiceUrl, ServiceRouter } from "./serviceRouter";
import { customJsonDateParser } from "../utils";
import { getToken } from "./helper";

function arrangeRequest(request: any): any {
  if (request !== undefined) {
    return request;
  }

  return {};
}

function getRequestHeaders(
  operationName: string,
  clientProps: IClientProxyProps
) {
  const headers: any = {
    // OperationName: operationName,
    //cros
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
  };

  headers["Content-Type"] = "application/json; charset=utf-8";
  axios.defaults.headers.common.Authorization = `Bearer ${getToken()}`;

  // if (isRefreshTime()) {
  //   headers.RefreshToken = getRefreshToken();
  // }

  return headers;
}

function getRequestConfig(
  clientProps: IClientProxyProps,
  method: ServiceCallTypeEnum,
  operationName: string,
  request?: any
): AxiosRequestConfig {
  const config: AxiosRequestConfig = {
    timeout: 120 * 1000, // 30 * 60 * 1000,
    // auth:
    headers: getRequestHeaders(operationName, clientProps),
    // transformResponse: [
    //   (res) => {
    //     if (res !== undefined && res !== null && res.length > 0) {
    //       return res
    //     }
    //   },
    // ],
  };

  switch (method) {
    case ServiceCallTypeEnum.Get:
    case ServiceCallTypeEnum.Delete:
      config.params = request;
      break;
    default:
      break;
  }

  return config;
}

export function Call<T>(
  method: ServiceCallTypeEnum,
  operationName: string,
  clientProps: IClientProxyProps,
  request?: any
): AxiosPromise<T> {
  const hasFullUrl = clientProps.hasFullUrl === true;

  const serviceUrl = hasFullUrl
    ? clientProps.url
    : `${getServiceUrl()}${clientProps.url}`;

  const arrangedRequest = arrangeRequest(request);
  const requestConfig = hasFullUrl
    ? {}
    : getRequestConfig(clientProps, method, operationName, arrangedRequest);

  switch (method) {
    case ServiceCallTypeEnum.Get:
      return axios.get(serviceUrl, requestConfig);
    case ServiceCallTypeEnum.Post:
      return axios.post(serviceUrl, arrangedRequest, requestConfig);
    case ServiceCallTypeEnum.Put:
      return axios.put(serviceUrl, arrangedRequest, requestConfig);
    case ServiceCallTypeEnum.Delete:
      return axios.delete(serviceUrl, requestConfig);
  }
}
