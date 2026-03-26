import { apiForAnon } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO } from "@/types/OrderType";

export interface PaymentSessionResponse {
  checkoutUrl: string;
}

export const api = {
  getOrders: () : ApiResponseType<OrderResponseDTO[]> => 
    apiForAnon.get("/orders"),

  createPaymentSession: (orderId: string, amount: number, customerEmail: string) =>
    apiForAnon.post<PaymentSessionResponse>("/payments/create-session", {
      orderId,
      amount,
      customerEmail
    })
};