import { apiForAnon, apiForAuthenticated, apiWithEtag } from "./api.config";
import type { ApiResponseType } from "@/types/ApiResponseType";
import type { OrderResponseDTO } from "@/types/OrderType";

export const api = {
  getOrders: () : ApiResponseType<OrderResponseDTO[]> => 
    apiForAnon.get("/orders"),
};