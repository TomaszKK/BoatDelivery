import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layouts/Layout";
import {
  adminRoutes,
  publicRoutes,
  customerRoutes,
  courierRoutes,
  sharedProtectedRoutes,
} from "./routes";
import { Pathnames } from "./pathnames";
import { useKeycloak } from "@/hooks/useKeycloak";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ 
  children, 
  isAllowed 
}: { 
  children: React.ReactNode; 
  isAllowed: boolean;
}) => {
  if (!isAllowed) {
    return <Navigate to={Pathnames.customer.home} replace />;
  }
  return children;
};

export const RoutesComponent = () => {
  const { keycloak, isInitialized } = useKeycloak();
  const { t } = useTranslation();
  const { isAdmin, isCourier, isCustomer } = useUserRoles();

  const isLogged = keycloak.isLogged;

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-primary animate-pulse text-lg font-semibold">
          {t("loading", "Ładowanie")}...
        </span>
      </div>
    );
  }

  const getHomePath = () => {
    if (!isLogged) return Pathnames.customer.home;
    if (isAdmin) return Pathnames.admin.dashboard;
    if (isCourier) return Pathnames.courier.route;
    if (isCustomer) return Pathnames.customer["mine-orders"];
    return Pathnames.customer.home;
  };

  const withLayout = (Component: React.ComponentType) => (
    <Layout>
      <Component />
    </Layout>
  );

return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to={getHomePath()} replace />} />

      {/* PUBLIC */}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={withLayout(Component)} />
      ))}

      {/* SHARED PROTECTED (Dostępne dla KAŻDEGO zalogowanego, np. Profil) */}
      {sharedProtectedRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute isAllowed={isLogged}>
              {withLayout(Component)}
            </ProtectedRoute>
          }
        />
      ))}

      {/* ADMIN - Protected */}
      {adminRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute isAllowed={isLogged && isAdmin}>
              {withLayout(Component)}
            </ProtectedRoute>
          }
        />
      ))}

      {/* CUSTOMER - Protected */}
      {customerRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute isAllowed={isLogged && isCustomer}>
              {withLayout(Component)}
            </ProtectedRoute>
          }
        />
      ))}

      {/* COURIER - Protected */}
      {courierRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute isAllowed={isLogged && isCourier}>
              {withLayout(Component)}
            </ProtectedRoute>
          }
        />
      ))}

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to={Pathnames.public.error} replace />}
      />
    </Routes>
  );
};