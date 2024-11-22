export class ServiceRouter {
  public static getAuthenticateUrl = (): string => {
    return `${getServiceUrl()}auth/login`;
  };

  public static getLogoutUrl = (): string => {
    return `${getServiceUrl()}authwithsession/logout`;
  };
}

export const getServiceUrl = (): string => {
  // return process.env.NEXT_PUBLIC_ENDPOINT_BASE!;
  // return "http://backend-service:3500/v1/";
  return "http://127.0.0.1:3500/v1/";

  // return "https://test.solyticket.com/api/v1/";
  if (typeof window === "undefined") {
    return (
      process.env.BACKEND_URL?.concat("/v1/") ||
      "http://backend-service:3500/v1/"
    );
  }

  return process.env.NEXT_PUBLIC_ENDPOINT_BASE || "/api/v1/";
};
