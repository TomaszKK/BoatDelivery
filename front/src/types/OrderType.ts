export type OrderStatus = "NEW" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface LocationRequestDTO {
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface LocationResponseDTO {
  latitude: number;
  longitude: number;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface OrderRequestDTO {
  customerId: string;
  weight: number;
  volume: number;
  pickupLocation: LocationRequestDTO;
  deliveryLocation: LocationRequestDTO;
}

export interface OrderResponseDTO {
  trackingNumber: string;
  customerId: string;
  status: OrderStatus;
  weight: number;
  volume: number;
  createdAt: string;
  pickupLocation: LocationResponseDTO;
  deliveryLocation: LocationResponseDTO;
}
