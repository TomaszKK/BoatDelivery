import { AxiosError } from "axios";
import { api } from "@/api/api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useOrderState } from "@/context/OrderContext";
import { trackPromise } from "react-promise-tracker";

export const useOrder = () => {
  const { t } = useTranslation();
  const { orders, setOrders } = useOrderState();

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
            : t("getAllOrdersFail", "There was an error fetching orders.")
        );
      } else {
        toast.error(t("getAllOrdersFail", "There was an error fetching orders."));
      }
      return e;
    }
  };

  return {
    orders,
    setOrders,
    getAllOrders,
  };
};