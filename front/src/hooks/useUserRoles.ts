import { useKeycloak } from "./useKeycloak";
import { useMemo } from "react";

export const useUserRoles = () => {
  const { keycloak, isInitialized } = useKeycloak();

  const roles = useMemo(() => {
    if (!isInitialized) {
      return [];
    }

    let token = keycloak.token;

    if (!token) {
      token = localStorage.getItem("accessToken") || undefined;
    }

    if (!token) {
    if (!isInitialized || !keycloak.isLogged || !keycloak.realmAccess) {
      return [];
    }
    return keycloak.realmAccess.roles || [];
  }, [keycloak.realmAccess, keycloak.isLogged, isInitialized]);

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return [];
      }

      const decoded = JSON.parse(atob(parts[1]));
      return decoded.realm_access?.roles || [];
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return [];
    }
  }, [keycloak.token, isInitialized]);

  const isAdmin = useMemo(() => {
    return roles.includes("ADMIN");
  }, [roles]);

  const isCourier = useMemo(() => {
    return roles.includes("COURIER");
  }, [roles]);

  const isCustomer = useMemo(() => {
    return roles.includes("CUSTOMER");
  }, [roles]);
  const isAdmin = roles.includes("ADMIN");
  const isCourier = roles.includes("COURIER");
  // Zabezpieczenie logiczne - tylko jeśli nikt inny nie zgłosił pretensji do roli, jesteś klientem
  const isCustomer = keycloak.isLogged && !isAdmin && !isCourier;

  return {
    roles,
    isAdmin,
    isCourier,
    isCustomer,
  };
};

