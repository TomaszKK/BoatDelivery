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
      return [];
    }

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

  return {
    roles,
    isAdmin,
    isCourier,
    isCustomer,
  };
};

