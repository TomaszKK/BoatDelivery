import { useEffect, useState, useCallback, useRef } from "react";
import Keycloak from "keycloak-js";

interface KeycloakUser {
  name?: string;
  email?: string;
  preferred_username?: string;
  family_name?: string;
  given_name?: string;
}

interface KeycloakState {
  token?: string;
  isLogged: boolean;
  user?: KeycloakUser;
}

let keycloakInstance: Keycloak | null = null;

const initKeycloakInstance = (): Keycloak => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8060",
      realm: import.meta.env.VITE_KEYCLOAK_REALM || "boat-delivery-realm",
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "auth-gateway",
    });
  }
  return keycloakInstance;
};

export const useKeycloak = () => {
  const [keycloak, setKeycloak] = useState<KeycloakState>({
    isLogged: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [keycloakClient, setKeycloakClient] = useState<Keycloak | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    // Zapobiegaj wielokrotnej inicjalizacji
    if (initRef.current) return;
    initRef.current = true;

    const initKeycloak = async () => {
      try {
        const instance = initKeycloakInstance();
        setKeycloakClient(instance);

        // Sprawdź czy już jest zalogowany
        if (instance.authenticated) {
          setKeycloak({
            isLogged: true,
            token: instance.token,
            user: instance.tokenParsed as KeycloakUser,
          });
          if (instance.token) {
            localStorage.setItem("accessToken", instance.token);
          }
          setIsInitialized(true);
          return;
        }

        const authenticated = await instance.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
          pkceMethod: "S256",
          scope: "openid profile email",
        });

        if (authenticated && instance.token) {
          localStorage.setItem("accessToken", instance.token);
          setKeycloak({
            isLogged: true,
            token: instance.token,
            user: instance.tokenParsed as KeycloakUser,
          });
        } else {
          setKeycloak({
            isLogged: false,
          });
        }
      } catch (error) {
        console.error("Keycloak initialization error:", error);
        setKeycloak({
          isLogged: false,
        });
      } finally {
        setIsInitialized(true);
      }
    };

    initKeycloak();
  }, []);

  const login = useCallback(() => {
    if (keycloakClient) {
      keycloakClient.login();
    }
  }, [keycloakClient]);

  const register = useCallback(() => {
    if (keycloakClient) {
      keycloakClient.register();
    }
  }, [keycloakClient]);

  const logout = useCallback(() => {
    if (keycloakClient) {
      localStorage.removeItem("accessToken");
      keycloakClient.logout({
        redirectUri: `${window.location.origin}/`,
      });
    }
  }, [keycloakClient]);

  return {
    keycloak,
    isInitialized,
    login,
    register,
    logout,
    isLogged: keycloak.isLogged,
  };
};
