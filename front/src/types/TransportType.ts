export enum TransportType {
  CAR = "CAR",
  VAN = "VAN",
  TRUCK = "TRUCK",
}

export interface Courier {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface Transport {
  id: string;
  courier?: Courier | null;
  transportType: TransportType;
  brand: string;
  model: string;
  fuelType?: string;
  trunkVolume?: number;
  cargoCapacity?: number;
  consumption?: number;
  licensePlate?: string;
  color?: string;
}
