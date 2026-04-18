import { apiForAuthenticated, apiForAnon } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO, TrackedOrder } from "@/types/OrderType";
import type { User } from "@/types/UserType";
import type { RouteResponseDTO } from "@/types/RoutingTypes";
import type { Transport } from "@/types/TransportType";
import type { NotificationLog } from "@/types/NotificationType";

export interface PaymentSessionResponse {
  checkoutUrl: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserCountByType {
  totalUsers: number;
  customerCount: number;
  courierCount: number;
  adminCount: number;
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

getOrdersPaged: (page: number = 0, size: number = 10, status?: string, search?: string) => {
    let url = `/orders?page=${page}&size=${size}`;
    if (status) {
      url += `&status=${status}`;
    }
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search.trim())}`;
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

  getAllUsersPaged: (page: number = 0, size: number = 10): ApiResponseType<PaginatedResponse<User>> =>
    apiForAuthenticated.get(`/user/paginated?page=${page}&size=${size}`),

  getUsersByTypePaged: (userType: string, page: number = 0, size: number = 10): ApiResponseType<PaginatedResponse<User>> =>
    apiForAuthenticated.get(`/user/paginated/by-type?userType=${userType}&page=${page}&size=${size}`),

  getUserCountByType: (): ApiResponseType<UserCountByType> =>
    apiForAuthenticated.get("/user/stats/count-by-type"),

  deleteUser: (userId: string) =>
    apiForAuthenticated.delete(`/user/${userId}`),

  // Transport endpoints
  getAllTransports: (): ApiResponseType<Transport[]> =>
    apiForAuthenticated.get("/transport"),

  getAllTransportsPaged: (page: number = 0, size: number = 10): ApiResponseType<PaginatedResponse<Transport>> =>
    apiForAuthenticated.get(`/transport/paginated?page=${page}&size=${size}`),

  getTransportById: (id: string): ApiResponseType<Transport> =>
    apiForAuthenticated.get(`/transport/${id}`),

  getTransportCountTotal: (): ApiResponseType<number> =>
    apiForAuthenticated.get("/transport/count"),

  createTransport: (transportData: any): ApiResponseType<Transport> =>
    apiForAuthenticated.post("/transport", transportData),

  updateTransport: (id: string, transportData: any): ApiResponseType<Transport> =>
    apiForAuthenticated.put(`/transport/${id}`, transportData),

  deleteTransport: (id: string) =>
    apiForAuthenticated.delete(`/transport/${id}`),

  assignTransportToCourier: (transportId: string, courierId: string) =>
    apiForAuthenticated.post(`/transport/${transportId}/assign/${courierId}`),

  unassignTransport: (transportId: string) =>
    apiForAuthenticated.post(`/transport/${transportId}/unassign`),

  getEmailLogs: (): ApiResponseType<EmailLog[]> =>
    apiForAuthenticated.get("/notifications/logs/email"),

  getSmsLogs: (): ApiResponseType<SmsLog[]> =>
    apiForAuthenticated.get("/notifications/logs/sms"),
};
