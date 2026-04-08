export enum TransportType {
  CAR = "CAR",
  VAN = "VAN",
  TRUCK = "TRUCK",
  BIKE = "BIKE",
  BOAT = "BOAT",
}

export interface Transport {
  id: string;
  courierId: string;
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
