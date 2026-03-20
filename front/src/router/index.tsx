import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layouts/Layout";
import {
  adminRoutes,
  publicRoutes,
  customerRoutes,
  courierRoutes,
} from "./routes";
import { Pathnames } from "./pathnames";

export const RoutesComponent = () => {
  const isLogged = true;
  const isAdmin = true;

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

      {customerRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={withLayout(Component)} />
      ))}

      {courierRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={withLayout(Component)} />
      ))}

      {adminRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={withLayout(Component)} />
      ))}

      <Route
        path="*"
        element={<Navigate to={Pathnames.public.error} replace />}
      />
    </Routes>
  );
};
