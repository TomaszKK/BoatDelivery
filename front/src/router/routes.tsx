import { MyOrdersPage } from "@/pages/MyOrdersPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminPage } from "@/pages/AdminPage";
import { Pathnames } from "./pathnames";
import { OrderDetailsPage } from "@/pages/OrderDetailsPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { CourierRoutePage } from "@/pages/CourierRoutePage";
import { HomePage } from "@/pages/HomePage";
import { AdminRoutingPage } from "@/pages/AdminRoutingPage";
import { AdminOrdersPage } from "@/pages/AdminOrdersPage";

export type RouteType = {
  path: string;
  Component: React.ComponentType<Record<string, unknown>>;
};

export const publicRoutes: RouteType[] = [
  {
    path: Pathnames.customer.home,
    Component: HomePage,
  },
  {
    path: Pathnames.public.error,
    Component: () => <h1 className="text-2xl font-bold text-center mt-20">404 - Page Not Found</h1>,
  },
];

export const customerRoutes: RouteType[] = [
  {
    path: Pathnames.customer.profile,
    Component: ProfilePage,
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
    path: Pathnames.customer.profile,
    Component: ProfilePage,
  },
  {
    path: Pathnames.courier.route,
    Component: CourierRoutePage,
  }
];

export const adminRoutes: RouteType[] = [
  {
    path: Pathnames.admin.dashboard,
    Component: AdminDashboardPage,
  },
  {
    path: Pathnames.admin.home,
    Component: AdminOrdersPage,
  },
  {
    path: Pathnames.admin.routing,
    Component: AdminRoutingPage,
  },
  {
    path: Pathnames.admin.accounts,
    Component: AdminPage,
  },
];
