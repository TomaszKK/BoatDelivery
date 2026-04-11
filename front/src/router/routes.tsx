import { MyOrdersPage } from "@/pages/MyOrdersPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminPage } from "@/pages/AdminPage";
import { AdminFleetPage } from "@/pages/AdminFleetPage";
import { Pathnames } from "./pathnames";
import { OrderDetailsPage } from "@/pages/OrderDetailsPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { CourierRoutePage } from "@/pages/CourierRoutePage";
import { HomePage } from "@/pages/HomePage";
import { AdminRoutingPage } from "@/pages/AdminRoutingPage";
import { AdminOrdersPage } from "@/pages/AdminOrdersPage";
import { AdminLogsPage } from "@/pages/AdminLogsPage";
import { PaymentPage } from "@/pages/PaymentPage";
import { PaymentSuccessPage } from "@/pages/PaymentSuccessPage";

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
    Component: () => (
      <h1 className="mt-20 text-center text-2xl font-bold">
        404 - Page Not Found
      </h1>
    ),
  },
];

export const customerRoutes: RouteType[] = [
  {
    path: Pathnames.customer.profile,
    Component: ProfilePage,
  },
  {
    path: Pathnames.customer["mine-orders"],
    Component: MyOrdersPage,
  },
  {
    path: Pathnames.customer["orders-details"],
    Component: OrderDetailsPage,
  },
  {
    path: "/payment/success",
    Component: PaymentSuccessPage,
  },
  {
    path: "/payment/cancel",
    Component: () => (
      <div className="mt-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Płatność anulowana</h1>
        <p className="mt-2">Twoje zamówienie nie zostało opłacone.</p>
      </div>
    ),
  },
  {
    path: "/payment/:orderId",
    Component: PaymentPage,
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
  },
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
  {
    path: Pathnames.admin.fleet,
    Component: AdminFleetPage,
  },
  {
    path: Pathnames.admin.logs,
    Component: AdminLogsPage,
  },
];
