import {
  KeyValuePair,
  ServiceCallTypeEnum,
  IException,
  IRequesterInfo,
} from "../models";
import { handleException } from "../utils";
import { clearLoginStorage } from "../utils/proxyUtils";
import * as ServiceProxy from "./serviceProxy";
import Swal from "sweetalert2";

interface IClientProxyProps {
  url: string;
  hasFullUrl?: boolean;
  requesterInfo?: IRequesterInfo;
}

export const dynamic = 'force-dynamic';
export class ClientProxy {
  public props: IClientProxyProps;
  public queryParams: KeyValuePair<any>;

  constructor(props: IClientProxyProps) {
    this.props = props;
    this.queryParams = new KeyValuePair<any>();
  }

  protected async getAsync<TResponse>(id?: string): Promise<TResponse> {
    return await this.callById<TResponse>(ServiceCallTypeEnum.Get, "Get", id);
  }

  protected async postAsync<TResponse>(request?: any): Promise<TResponse> {
    return await this.callByRequest<TResponse>(
      ServiceCallTypeEnum.Post,
      this.props.url,
      "Post",
      request
    );
  }

  protected async deleteAsync<TResponse>(id?: string): Promise<TResponse> {
    return await this.callById(ServiceCallTypeEnum.Delete, "Delete", id);
  }

  protected async putAsync<TResponse>(
    id: string | number | undefined,
    request?: any
  ): Promise<TResponse> {
    let url: string = this.props.url;

    if (id) {
      const idVal = id.toString();

      if (idVal.length > 0) {
        url = url.concat("/").concat(idVal);
      }
    }

    return await this.callByRequest<TResponse>(
      ServiceCallTypeEnum.Put,
      url,
      "Put",
      request
    );
  }

  private async callById<TResponse>(
    serviceCallTypeEnum: ServiceCallTypeEnum,
    operationName: string,
    id?: string
  ): Promise<TResponse> {
    const url = this.getQueryUrl(id);

    return await ServiceProxy.Call<TResponse>(
      serviceCallTypeEnum,
      operationName,
      this.getClientProps({ url })
    )
      .then((response: any) => {
        return response?.data;
      })
      .catch(async (err: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        // console.log(err);
        Toast.fire({
          icon: "error",
          title: err.response
            ? err.response.data.message
            : "Unknown error occurred",
        });
        const response: IException = handleException(err);

        if (response.httpStatusCode !== 401) {
          throw response;
        }

        clearLoginStorage();

        if (typeof window !== "undefined") {
          let redirectUrl: string = "/login";

          if (this.props.requesterInfo?.returnUrlOnRedirectLogin) {
            redirectUrl = `${redirectUrl}?return-url=${this.props.requesterInfo?.returnUrlOnRedirectLogin}`;
          }

          window.location.href = redirectUrl;
        }
      });
  }

  private async callByRequest<TResponse>(
    serviceCallTypeEnum: ServiceCallTypeEnum,
    url: string,
    operationName: string,
    request?: any
  ): Promise<TResponse> {
    return await ServiceProxy.Call<TResponse>(
      serviceCallTypeEnum,
      operationName,
      this.getClientProps({ url }),
      request
    )
      .then((response: any) => {
        return response?.data;
      })
      .catch(async (err: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        // console.log(err);
        Toast.fire({
          icon: "error",
          title: err.response
            ? err.response.data.message
            : "Unknown error occurred",
        });
        const response: IException = handleException(err);

        if (response.httpStatusCode !== 401) {
          throw response;
        }

        clearLoginStorage();

        if (typeof window !== "undefined") {
          let redirectUrl: string = "/login";

          if (this.props.requesterInfo?.returnUrlOnRedirectLogin) {
            redirectUrl = `${redirectUrl}?return-url=${this.props.requesterInfo?.returnUrlOnRedirectLogin}`;
          }

          window.location.href = redirectUrl;
        }
      });
  }

  private getClientProps = (
    options: Partial<IClientProxyProps>
  ): IClientProxyProps => {
    return Object.assign({}, this.props, options);
  };

  private getQueryUrl = (pathQuery?: string): string => {
    let url: string = this.props.url;

    if (pathQuery && pathQuery.length > 0) {
      url = url.concat("/").concat(pathQuery);
    }

    const queries: string[] = [];

    if (this.queryParams.hasValue()) {
      queries.push(this.getQueryFromHash(this.queryParams));
    }

    if (queries.length > 0) {
      url = url.concat("?");

      queries.forEach((query, index) => {
        url = url.concat(query);

        if (index < queries.length - 1) {
          url = url.concat("&");
        }
      });
    }

    return url;
  };

  private toQueryParams = (source: any): string => {
    var array: string[] = [];

    for (var key in source) {
      array.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(source[key])
      );
    }

    return array.join("&");
  };

  private getQueryFromHash = (hash: KeyValuePair<any>): string => {
    const hashObject = hash.join();

    return this.toQueryParams(hashObject);
  };
}
