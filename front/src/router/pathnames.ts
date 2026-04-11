export const Pathnames = {
  public: {
    register: "/register",
    error: "/404",
  },
  courier: {
    route: "/route",
  },
  customer: {
    home: "/home",
    track: "/track",
    "mine-orders": "/mine-orders",
    "orders-details": "/orders/:trackingNumber",
    profile: "/profile",
    "payment-success": "/payment/success",
    "payment-cancel": "/payment/cancel",
    "payment-details": "/payment/:orderId",
  },
  admin: {
    home: "/orders",
    dashboard: "/dashboard",
    routing: "/routing",
    accounts: "/accounts",
    fleet: "/fleet",
    logs: "/logs",
  },
};
