import { AxiosError } from "axios";
import { api } from "@/api/api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useOrderState } from "@/context/OrderContext";
import { trackPromise } from "react-promise-tracker";

import type { OrderRequestDTO } from "@/types/OrderType";

export const useOrder = () => {
  const { t } = useTranslation();
  const { orders, setOrders } = useOrderState();
  const { order, setOrder } = useOrderState();

  const getAllOrders = async () => {
    try {
      const response = await trackPromise(api.getOrders());

      const data = response.data;

      setOrders(data);
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(
          e.response?.data?.message !== undefined
            ? t(`${e.response.data.message}`)
            : t("orders.getAllFail"),
        );
      } else {
        toast.error(t("orders.getAllFail"));
      }
      return e;
    }
  };

  const getOrderByTrackingNumber = async (trackingNumber: string) => {
    try {
      const response = await trackPromise(
        api.getOrderByTrackingNumber(trackingNumber),
      );

      const data = response.data;
      setOrder(data);
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(
          e.response?.data?.message !== undefined
            ? t(`${e.response.data.message}`)
            : t("orders.getFail"),
        );
      } else {
        toast.error(t("orders.getFail"));
      }
      return e;
    }
  };

  const createOrder = async (orderData: OrderRequestDTO) => {
    try {
      const response = await trackPromise(api.createOrder(orderData));

      const newOrder = response.data;

      setOrders([newOrder, ...(orders || [])]);

      toast.success(t("orders.createSuccess"));

      return newOrder;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(
          e.response?.data?.message !== undefined
            ? t(`${e.response.data.message}`)
            : t("orders.createFail"),
        );
      } else {
        toast.error(t("orders.createFail"));
      }

      throw e;
    }
  };

  return {
    orders,
    setOrders,
    order,
    setOrder,
    getAllOrders,
    createOrder,
    getOrderByTrackingNumber,
  };
};
