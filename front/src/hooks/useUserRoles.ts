import { useKeycloak } from "./useKeycloak";
import { useMemo } from "react";

export const useUserRoles = () => {
  const { keycloak, isInitialized } = useKeycloak();

  const roles = useMemo(() => {
    if (!isInitialized || !keycloak.isLogged || !keycloak.realmAccess) {
      return [];
    }
    return keycloak.realmAccess.roles || [];
  }, [keycloak.realmAccess, keycloak.isLogged, isInitialized]);

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