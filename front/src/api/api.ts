import { apiForAnon } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO } from "@/types/OrderType";

export const api = {
  getOrders: (): ApiResponseType<OrderResponseDTO[]> =>
    apiForAnon.get("/orders"),
  getMineOrders: (): ApiResponseType<OrderResponseDTO[]> =>
    apiForAnon.get("/orders/mine"),
  createOrder: (orderData: any): ApiResponseType<OrderResponseDTO> =>
    apiForAnon.post("/orders", orderData),
};
