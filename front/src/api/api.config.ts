import axios from "axios";
import { type AxiosInstance } from "axios";
import Keycloak from "keycloak-js";

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

let keycloakInstance: Keycloak | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || "");
    }
  });
  failedQueue = [];
};

const addAuthInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor do obsługi 401 Unauthorized
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { config, response } = error;

      if (response?.status === 401 && config && !config.__isRetry) {
        if (isRefreshing) {
          // Jeśli już się odświeża, czekaj w kolejce
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            return instance(config);
          });
        }

        isRefreshing = true;
        config.__isRetry = true;

        try {
          // Inicjalizuj Keycloak jeśli nie istnieje
          if (!keycloakInstance) {
            keycloakInstance = new Keycloak({
              url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8060",
              realm: import.meta.env.VITE_KEYCLOAK_REALM || "boat-delivery-realm",
              clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "auth-gateway",
            });
          }

          // Spróbuj odświeżyć token
          return keycloakInstance
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed && keycloakInstance?.token) {
                const newToken = keycloakInstance.token;
                localStorage.setItem("accessToken", newToken);
                config.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                isRefreshing = false;
                return instance(config);
              } else {
                throw new Error("Token refresh failed");
              }
            })
            .catch((err) => {
              // Odświeżanie nieudane, czyszczenie i wylogowanie
              localStorage.removeItem("accessToken");
              processQueue(err, null);
              isRefreshing = false;
              return Promise.reject(err);
            });
        } catch (err) {
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
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

// Funkcja do ustawienia instancji Keycloaka (wywoływana z hooku)
export const setKeycloakInstance = (instance: Keycloak) => {
  keycloakInstance = instance;
};

