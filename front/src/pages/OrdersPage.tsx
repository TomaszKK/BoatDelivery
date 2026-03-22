import { useEffect } from "react";
import { useOrder } from "@/hooks/useOrder";

export const OrdersPage = () => {
  const { orders, getAllOrders } = useOrder();

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div>
      {orders ? (
        <ul>
          {orders.map(o => <li key={o.id}>{o.id} - {o.status}</li>)}
        </ul>
      ) : (
        <p>Brak zamówień</p>
      )}
    </div>
  );
};