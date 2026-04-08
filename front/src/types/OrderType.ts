export type OrderStatus =
  | "ORDER_CREATED"
  | "CALCULATING_ROUTE_RECEIVE"
  | "ROUTE_ASSIGNED_RECEIVE"
  | "IN_TRANSIT_FOR_PACKAGE"
  | "ORDER_RECEIVED_FROM_CUSTOMER"
  | "IN_SORTING_CENTER"
  | "CALCULATING_ROUTE_DELIVERY"
  | "ROUTE_ASSIGNED_DELIVERY"
  | "IN_TRANSIT_TO_CUSTOMER"
  | "DELIVERY_COMPLETED"
  | "ORDER_CANCELED";

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

export interface TrackedOrder {
  trackingNumber: string;
  status: string;
  weight: number;
}
