import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
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

interface KeycloakContextType {
  keycloak: KeycloakState;
  isInitialized: boolean;
  login: () => void;
  register: () => void;
  logout: () => void;
  updatePassword: () => void;
  refreshToken: () => Promise<void>;
  isLogged: boolean;
}

const KeycloakContext = createContext<KeycloakContextType | null>(null);

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

export const KeycloakProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [keycloak, setKeycloak] = useState<KeycloakState>({ isLogged: false });
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initKeycloak = async () => {
      try {
        const instance = initKeycloakInstance();

        // ==========================================
        // Automatyczne odświeżanie tokena!
        // ==========================================
        instance.onTokenExpired = () => {
          console.log("Token expired, trying to refresh...");
          instance
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed && instance.token) {
                localStorage.setItem("accessToken", instance.token);
                setKeycloak({
                  isLogged: true,
                  token: instance.token,
                  user: instance.tokenParsed as KeycloakUser,
                  realmAccess: instance.realmAccess,
                });
              }
            })
            .catch(() => {
              console.warn("Failed to refresh token. Logging out.");
              localStorage.removeItem("accessToken");
              setKeycloak({ isLogged: false });
            });
        };

        if (initStarted) {
          const storedToken = localStorage.getItem("accessToken");
          if (storedToken) {
            try {
              const decoded = JSON.parse(atob(storedToken.split(".")[1]));
              // Sprawdź czy zdekodowany token już nie wygasł!
              const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();

              if (!isExpired) {
                setKeycloak({
                  isLogged: true,
                  token: storedToken,
                  user: decoded as KeycloakUser,
                  realmAccess: decoded.realm_access,
                });
                setIsInitialized(true);
                return;
              } else {
                localStorage.removeItem("accessToken");
              }
            } catch {
              // Ignore decode error
            }
          }

          if (instance.authenticated && instance.token) {
            localStorage.setItem("accessToken", instance.token);
            setKeycloak({
              isLogged: true,
              token: instance.token,
              user: instance.tokenParsed as KeycloakUser,
              realmAccess: instance.realmAccess,
            });
          } else {
            setKeycloak({ isLogged: false });
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
            realmAccess: instance.realmAccess,
          });
        } else {
          setKeycloak({ isLogged: false });
        }
      } catch (error) {
        console.error("Keycloak initialization error:", error);
        setKeycloak({ isLogged: false });
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
      instance.login({ action: "UPDATE_PASSWORD" });
    } catch (error) {
      console.error("Error calling updatePassword:", error);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const instance = initKeycloakInstance();
      if (instance.isTokenExpired(5)) {
        // Token wygaśnie za mniej niż 5 sekund, odśwież go
        await instance.updateToken(30);
      } else {
        // Wymuś refresh nawet jeśli token jeszcze nie wygasł
        await instance.updateToken(-1);
      }

      if (instance.token) {
        localStorage.setItem("accessToken", instance.token);
        setKeycloak({
          isLogged: true,
          token: instance.token,
          user: instance.tokenParsed as KeycloakUser,
          realmAccess: instance.realmAccess,
        });
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }, []);

  const contextValue: KeycloakContextType = {
    keycloak,
    isInitialized,
    login,
    register,
    logout,
    updatePassword,
    refreshToken,
    isLogged: keycloak.isLogged,
  };

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = (): KeycloakContextType => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within a KeycloakProvider");
  }
  return context;
};
