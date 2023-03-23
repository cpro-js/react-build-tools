import { AxiosRequestConfig } from "axios";
import qs from "query-string";

export const ODATA_SERVICE_PATHS = {
  main: "<%= odataServicePath %>",
};

export const odataConfig: AxiosRequestConfig = {
  timeout: 20000,
  paramsSerializer: params => qs.stringify(params, { arrayFormat: "none" }),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const createODataConfig = (language: string, resolveUri: (url: string) => string): AxiosRequestConfig => {
  return {
    ...odataConfig,
    headers: {
      ...odataConfig.headers,
      // needed if current language differs from browser language, e.g. via query param
      "Accept-Language": language,
    },
    //
    baseURL: odataConfig.baseURL ? resolveUri(odataConfig.baseURL) : "",
  };
};
