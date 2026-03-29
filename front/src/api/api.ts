import { apiForAuthenticated, apiForAnon } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO } from "@/types/OrderType";

export interface PaymentSessionResponse {
  checkoutUrl: string;
}

export const api = {
  getMineOrders: (): ApiResponseType<OrderResponseDTO[]> =>
    apiForAnon.get("/orders/mine"),
  createOrder: (orderData: any): ApiResponseType<OrderResponseDTO> =>
    apiForAnon.post("/orders", orderData),
  getOrders: () : ApiResponseType<OrderResponseDTO[]> =>
      apiForAuthenticated.get("/orders"),

  createPaymentSession: (orderId: string, amount: number, customerEmail: string) =>
      apiForAuthenticated.post<PaymentSessionResponse>("/payments/create-session", {
      orderId,
      amount,
      customerEmail
    })
};
