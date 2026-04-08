export const UserType = {
  CUSTOMER: "CUSTOMER",
  COURIER: "COURIER",
  ADMIN: "ADMIN",
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

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
