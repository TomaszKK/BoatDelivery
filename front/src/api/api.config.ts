import axios from "axios";
import { type AxiosInstance } from "axios";

export const API_URL = "http://localhost:8080/api";
export const TIMEOUT_IN_MS = 30000; // 30 seconds
export const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-type": "application/json",
};

const createAxiosInstance = (additionalHeaders = {}) =>
  axios.create({
    baseURL: API_URL,
    timeout: TIMEOUT_IN_MS,
    headers: { ...DEFAULT_HEADERS, ...additionalHeaders },
  });

const addAuthInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
};

export const apiForAnon = createAxiosInstance();
export const apiForAuthenticated = createAxiosInstance();
addAuthInterceptors(apiForAuthenticated);
export const apiWithEtag = createAxiosInstance();
addAuthInterceptors(apiWithEtag);
apiWithEtag.interceptors.request.use((config) => {
  config.headers["If-Match"] = localStorage.getItem("etag") || "";
  return config;
});
apiWithEtag.interceptors.response.use((response) => {
  if (response.headers.etag) {
    localStorage.setItem("etag", response.headers.etag.slice(3, -1));
  }
  return response;
});
