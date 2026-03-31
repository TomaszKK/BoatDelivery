import { apiForAuthenticated } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO } from "@/types/OrderType";
import type { User } from "@/types/UserType";

export interface PaymentSessionResponse {
  checkoutUrl: string;
}

export const api = {
  getOrders: () : ApiResponseType<OrderResponseDTO[]> =>
      apiForAuthenticated.get("/orders"),

  createPaymentSession: (orderId: string, amount: number, customerEmail: string) =>
      apiForAuthenticated.post<PaymentSessionResponse>("/payments/create-session", {
      orderId,
      amount,
      customerEmail
    }),

  getAllUsers: (): ApiResponseType<User[]> =>
      apiForAuthenticated.get("/user")
};