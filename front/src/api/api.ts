import { apiForAuthenticated, apiForAnon } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO } from "@/types/OrderType";
import type { User } from "@/types/UserType";
import type { RouteResponseDTO } from "@/types/RoutingTypes";

export interface PaymentSessionResponse {
  checkoutUrl: string;
}

export const api = {
  getMineOrders: (): ApiResponseType<OrderResponseDTO[]> =>
    apiForAnon.get("/orders/mine"),
  createOrder: (orderData: any): ApiResponseType<OrderResponseDTO> =>
    apiForAnon.post("/orders", orderData),
  getOrders: (): ApiResponseType<OrderResponseDTO[]> =>
    apiForAuthenticated.get("/orders"),
  getOrderByTrackingNumber: (
    trackingNumber: string,
  ): ApiResponseType<OrderResponseDTO> =>
    apiForAuthenticated.get(`/orders/tracking/${trackingNumber}`),

  getAlgorithm: () =>
    apiForAuthenticated.get<{ currentAlgorithm: string }>(
      "/orders/admin/routing/settings/algorithm",
    ),

  setAlgorithm: (type: string) =>
    apiForAuthenticated.post(`/orders/admin/routing/settings/algorithm?type=${type}`),

  forceOptimize: () =>
    apiForAuthenticated.post("/orders/admin/routing/force-optimize"),

  getRoutes: () => apiForAuthenticated.get<RouteResponseDTO[]>("/orders/routes"),

  startRoute: (routeId: string) =>
    apiForAuthenticated.post(`/orders/routes/${routeId}/start`),

  completeStop: (stopId: string) =>
    apiForAuthenticated.post(`/orders/routes/stops/${stopId}/complete`),

  finishRoute: (routeId: string) =>
    apiForAuthenticated.post(`/orders/routes/${routeId}/finish`),

  createPaymentSession: (
    orderId: string,
    amount: number,
    customerEmail: string,
  ) =>
    apiForAuthenticated.post<PaymentSessionResponse>(
      "/payments/create-session",
      {
        orderId,
        amount,
        customerEmail,
      },
    ),

  getAllUsers: (): ApiResponseType<User[]> => apiForAuthenticated.get("/user"),
};
