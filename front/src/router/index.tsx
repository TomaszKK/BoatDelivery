import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layouts/Layout";
import {
  adminRoutes,
  publicRoutes,
  customerRoutes,
  courierRoutes,
} from "./routes";
import { Pathnames } from "./pathnames";
import { useKeycloak } from "@/hooks/useKeycloak";
import { useUserRoles } from "@/hooks/useUserRoles";

export const RoutesComponent = () => {
  const { keycloak, isInitialized } = useKeycloak();
  const { isAdmin } = useUserRoles();

  const isLogged = keycloak.isLogged;

  console.log("RoutesComponent rendering:", { isInitialized, isLogged, isAdmin, token: !!keycloak.token });

  // Nie renderuj routes dopóki keycloak się nie zainitialize
  if (!isInitialized) {
    return <div className="flex min-h-screen items-center justify-center">Inicjalizacja...</div>;
  }

  const withLayout = (Component: React.ComponentType) => (
    <Layout>
      <Component />
    </Layout>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={(() => {
          if (!isLogged)
            return <Navigate to={Pathnames.public.login} replace />;
          if (isAdmin)
            return <Navigate to={Pathnames.admin.dashboard} replace />;

          return <Navigate to={Pathnames.customer.home} replace />;
        })()}
      />

      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={withLayout(Component)} />
      ))}

      {/* Admin routes - renderuj jako pierwsze */}
      {adminRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            isAdmin
              ? withLayout(Component)
              : <Navigate to={Pathnames.customer.home} replace />
          }
        />
      ))}

      {customerRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={withLayout(Component)} />
      ))}

      {courierRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={withLayout(Component)} />
      ))}

      <Route
        path="*"
        element={<Navigate to={Pathnames.public.error} replace />}
      />
    </Routes>
  );
};
