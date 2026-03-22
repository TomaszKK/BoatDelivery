export type OrderStatus = "NEW" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface DeliveryLocationDTO {
  addressLine: string;
  latitude: number;
  longitude: number;
}

export interface OrderResponseDTO {
  id: string;
  customerId: string;
  status: OrderStatus;
  weight: number;
  volume: number;
  createdAt: string;
  deliveryLocation: DeliveryLocationDTO;
}