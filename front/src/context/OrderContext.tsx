import { createContext, useContext, useState, type ReactNode } from "react";
import type { OrderResponseDTO } from "@/types/OrderType";

interface OrderState {
  orders: OrderResponseDTO[] | null;
  setOrders: (orders: OrderResponseDTO[] | null) => void;
}

const OrderStateContext = createContext<OrderState | null>(null);

export const OrderStateProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderResponseDTO[] | null>(null);

  return (
    <OrderStateContext.Provider
      value={{
        orders,
        setOrders,
      }}
    >
      {children}
    </OrderStateContext.Provider>
  );
};

export const useOrderState = () => {
  const orderState = useContext(OrderStateContext);

  if (!orderState) {
    throw new Error("You forgot about OrderStateProvider!");
  }

  return orderState;
};