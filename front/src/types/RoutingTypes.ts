import type { OrderResponseDTO } from "./OrderType";

export type AlgorithmType =
  | "TIMEFOLD_ADVANCED"
  | "GREEDY_SIMPLE"
  | "BRUTE_FORCE";

export interface RouteStopDTO {
  id: string;
  stopSequence: number;
  order: OrderResponseDTO;
  estimatedArrivalTime?: string;
}

export interface RouteResponseDTO {
  id: string;
  courierId: string;
  status: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  stops: RouteStopDTO[];
}
