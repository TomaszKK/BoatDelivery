export enum UserType {
  CUSTOMER = "CUSTOMER",
  COURIER = "COURIER",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  keycloakId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userType?: UserType;
  createdAt?: string;
  updatedAt?: string;
}
