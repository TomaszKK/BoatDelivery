export const UserType = {
  CUSTOMER: "CUSTOMER",
  COURIER: "COURIER",
  ADMIN: "ADMIN",
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

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

export interface PaymentSessionResponse {
  checkoutUrl: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserCountByType {
  totalUsers: number;
  customerCount: number;
  courierCount: number;
  adminCount: number;
}
