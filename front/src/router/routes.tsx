import { MyOrdersPage } from "@/pages/MyOrdersPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { Pathnames } from "./pathnames";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
    <h1 className="text-primary text-4xl font-bold">{title}</h1>
    <p className="text-muted-foreground">Strona w budowie...</p>
  </div>
);

export type RouteType = {
  path: string;
  Component: React.ComponentType<any>;
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
    Component: MyOrdersPage,
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
    Component: () => <PlaceholderPage title="Zarządzanie Użytkownikami" />,
  },
];
