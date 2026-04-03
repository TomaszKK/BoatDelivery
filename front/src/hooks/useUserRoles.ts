import { useKeycloak } from "./useKeycloak";
import { useMemo } from "react";

export const useUserRoles = () => {
  const { keycloak, isInitialized } = useKeycloak();

  const roles = useMemo(() => {
    if (!isInitialized || !keycloak.token) {
      return [];
    }

    try {
      const parts = keycloak.token.split(".");
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

  const isAdmin = roles.includes("ADMIN");
  const isCourier = roles.includes("COURIER");
  const isCustomer = keycloak.isLogged && !isAdmin && !isCourier; 

  return {
    roles,
    isAdmin,
    isCourier,
    isCustomer,
  };
};