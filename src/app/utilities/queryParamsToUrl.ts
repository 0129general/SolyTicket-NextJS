export const queryParamsToURL = (baseURL: string, queryParams: { [key: string]: string }): string => {
  let url = baseURL;
  const keys = Object.keys(queryParams);

  if (keys.length > 0) {
    url += "?";

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = queryParams[key];

      url += `${key}=${value}`;

      if (i !== keys.length - 1) {
        url += "&";
      }
    }
  }

  return url;
}