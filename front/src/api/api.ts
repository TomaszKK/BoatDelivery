import { apiForAuthenticated, apiForAnon } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO, TrackedOrder } from "@/types/OrderType";
import type { User } from "@/types/UserType";
import type { RouteResponseDTO } from "@/types/RoutingTypes";

export interface PaymentSessionResponse {
  checkoutUrl: string;
}

export const api = {
  getMineOrders: (): ApiResponseType<OrderResponseDTO[]> =>
    apiForAuthenticated.get("/orders/my"),

  createOrder: (orderData: any): ApiResponseType<OrderResponseDTO> =>
    apiForAuthenticated.post("/orders", orderData),

  getOrders: (): ApiResponseType<OrderResponseDTO[]> =>
    apiForAuthenticated.get("/orders"),

  archiveOrder: (trackingNumber: string) =>
    apiForAuthenticated.delete(`/orders/${trackingNumber}`),

  getOrdersPaged: (page: number = 0, size: number = 10, status?: string) => {
    let url = `/orders?page=${page}&size=${size}`;
    if (status) {
      url += `&status=${status}`;
    }
    return apiForAuthenticated.get(url);
  },

  getAdminStats: () => apiForAuthenticated.get("/orders/stats"),
  getOrderByTrackingNumber: (
    trackingNumber: string,
  ): ApiResponseType<OrderResponseDTO> =>
    apiForAuthenticated.get(`/orders/tracking/${trackingNumber}`),
  getMininalizedOrderByTrackingNumber: (
    trackingNumber: string,
  ): ApiResponseType<TrackedOrder> =>
    apiForAnon.get(`/orders/tracking/minimalized/${trackingNumber}`),

  getAlgorithm: () =>
    apiForAuthenticated.get<{ currentAlgorithm: string }>(
      "/orders/admin/routing/settings/algorithm",
    ),

  setAlgorithm: (type: string) =>
    apiForAuthenticated.post(
      `/orders/admin/routing/settings/algorithm?type=${type}`,
    ),

  forceOptimize: () =>
    apiForAuthenticated.post("/orders/admin/routing/force-optimize"),

  getRoutes: () =>
    apiForAuthenticated.get<RouteResponseDTO[]>("/orders/routes"),

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
