import { MyOrdersPage } from "@/pages/MyOrdersPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminPage } from "@/pages/AdminPage";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Pathnames } from "./pathnames";
import { OrderDetailsPage } from "@/pages/OrderDetailsPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { CourierRoutePage } from "@/pages/CourierRoutePage";

export type RouteType = {
  path: string;
  Component: React.ComponentType<Record<string, unknown>>;
};

// DODANO: Strona główna jest teraz publiczna
export const publicRoutes: RouteType[] = [
  {
    path: Pathnames.customer.home, 
    Component: () => <PlaceholderPage title="Strona Główna" />,
  },
  {
    path: Pathnames.public.error,
    Component: () => <PlaceholderPage title="Błąd 404" />,
  },
];

// USUNIĘTO stąd stronę główną
export const customerRoutes: RouteType[] = [
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
  {
    path: Pathnames.customer.ordersDetails,
    Component: OrderDetailsPage,
  },
];

export const courierRoutes: RouteType[] = [
  {
    path: Pathnames.courier.route,
    Component: CourierRoutePage,
  },
  {
    path: Pathnames.courier.deliveries,
    Component: () => <PlaceholderPage title="Aktywne Zlecenia" />,
  },
];

export const adminRoutes: RouteType[] = [
  {
    path: Pathnames.admin.dashboard,
    Component: AdminDashboardPage,
  },
  {
    path: Pathnames.admin.accounts,
    Component: AdminPage,
  },
];