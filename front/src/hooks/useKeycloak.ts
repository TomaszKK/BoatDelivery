import { useEffect, useState, useCallback, useRef } from "react";
import Keycloak, { type KeycloakTokenParsed } from "keycloak-js";

interface KeycloakUser extends KeycloakTokenParsed {
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
  realmAccess?: { roles: string[] };
}

let keycloakInstance: Keycloak | null = null;
let initStarted = false;

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
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initKeycloak = async () => {
      try {
        const instance = initKeycloakInstance();

        if (initStarted) {
          const storedToken = localStorage.getItem("accessToken");
          if (storedToken) {
            try {
              const decoded = JSON.parse(atob(storedToken.split(".")[1]));
              setKeycloak({
                isLogged: true,
                token: storedToken,
                user: decoded as KeycloakUser,
                realmAccess: decoded.realm_access, // <-- DODANO
              });
              setIsInitialized(true);
              return;
            } catch (e) {
              // Ignore decode error
            }
          }

          if (instance.authenticated && instance.token) {
            localStorage.setItem("accessToken", instance.token);
            setKeycloak({
              isLogged: true,
              token: instance.token,
              user: instance.tokenParsed as KeycloakUser,
              realmAccess: instance.realmAccess, // <-- DODANO
            });
          } else {
            setKeycloak({
              isLogged: false,
            });
          }
          setIsInitialized(true);
          return;
        }

        initStarted = true;

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
            realmAccess: instance.realmAccess, // <-- DODANO
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
    try {
      const instance = initKeycloakInstance();
      instance.login();
    } catch (error) {
      console.error("Error calling login:", error);
    }
  }, []);

  const register = useCallback(() => {
    try {
      const instance = initKeycloakInstance();
      instance.register();
    } catch (error) {
      console.error("Error calling register:", error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      const instance = initKeycloakInstance();
      if (instance) {
        localStorage.removeItem("accessToken");
        instance.logout({
          redirectUri: `${window.location.origin}/`,
        });
      }
    } catch (error) {
      console.error("Error calling logout:", error);
    }
  }, []);

  const updatePassword = useCallback(() => {
    try {
      const instance = initKeycloakInstance();
      instance.login({
        action: "UPDATE_PASSWORD",
      });
    } catch (error) {
      console.error("Error calling updatePassword:", error);
    }
  }, []);

  return {
    keycloak,
    isInitialized,
    login,
    register,
    logout,
    updatePassword,
    isLogged: keycloak.isLogged,
  };
};