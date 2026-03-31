import { OrdersPage } from "@/pages/OrdersPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminPage } from "@/pages/AdminPage";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Pathnames } from "./pathnames";


export type RouteType = {
  path: string;
  Component: React.ComponentType<Record<string, unknown>>;
};

export const publicRoutes: RouteType[] = [
  {
    path: Pathnames.public.login,
    Component: () => <PlaceholderPage title="Logowanie" />,
  },
  {
    path: Pathnames.public.register,
    Component: () => <PlaceholderPage title="Rejestracja" />,
  },
  {
    path: Pathnames.public.error,
    Component: () => <PlaceholderPage title="Błąd 404" />,
  },
];

export const customerRoutes: RouteType[] = [
  {
    path: Pathnames.customer.home,
    Component: () => <PlaceholderPage title="Strona Główna" />,
  },
  {
    path: Pathnames.customer.profile,
    Component: ProfilePage,
  },
  {
    path: Pathnames.customer.track,
    Component: () => <PlaceholderPage title="Śledzenie Paczki" />,
  },
  {
    path: Pathnames.customer.orders,
    Component: OrdersPage,
  },
];

export const courierRoutes: RouteType[] = [
  {
    path: Pathnames.courier.route,
    Component: () => <PlaceholderPage title="Moja Trasa (Mapa)" />,
  },
  {
    path: Pathnames.courier.deliveries,
    Component: () => <PlaceholderPage title="Aktywne Zlecenia" />,
  },
];

export const adminRoutes: RouteType[] = [
  {
    path: Pathnames.admin.dashboard,
    Component: () => <PlaceholderPage title="Panel Dyspozytora" />,
  },
  {
    path: Pathnames.admin.accounts,
    Component: AdminPage,
  },
];
