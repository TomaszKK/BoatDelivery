import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { api } from "@/api/api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { trackPromise } from "react-promise-tracker";
import type { AlgorithmType } from "@/types/RoutingTypes";
import type { OrderStatus } from "@/types/OrderType";

export const useAdminRouting = () => {
  const { t } = useTranslation();

  const [currentAlgorithm, setCurrentAlgorithm] =
    useState<AlgorithmType | null>(null);
  const [stats, setStats] = useState<Record<OrderStatus, number>>({} as Record<OrderStatus, number>);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const [sortingCenterOrders, setSortingCenterOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchAlgorithm = useCallback(async () => {
    try {
      const response = await trackPromise(api.getAlgorithm());
      setCurrentAlgorithm(response.data.currentAlgorithm as AlgorithmType);
    } catch (e) {
      toast.error(
        t(
          "admin.fetchAlgorithmFail",
          "Nie udało się pobrać aktualnego algorytmu.",
        ),
      );
    }
  }, [t]);

  const changeAlgorithm = async (type: AlgorithmType) => {
    try {
      await trackPromise(api.setAlgorithm(type));
      setCurrentAlgorithm(type);
      toast.success(
        t("admin.changeAlgorithmSuccess", "Pomyślnie zmieniono algorytm!"),
      );
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(
          e.response?.data?.message ||
            t("admin.changeAlgorithmFail", "Błąd zmiany algorytmu."),
        );
      } else {
        toast.error(t("admin.changeAlgorithmFail", "Błąd zmiany algorytmu."));
      }
    }
  };

  const forceOptimize = async () => {
    try {
      await trackPromise(api.forceOptimize());
      toast.success(
        t(
          "admin.forceOptimizeSuccess",
          "Trasy zostały pomyślnie zoptymalizowane!",
        ),
      );
    } catch (e) {
      toast.error(
        t(
          "admin.forceOptimizeFail",
          "Wystąpił błąd podczas wymuszania optymalizacji.",
        ),
      );
    }
  };

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await trackPromise(api.getAdminStats());
      setStats(response.data);
    } catch (e) {
      toast.error(t("admin.fetchStatsFail", "Nie udało się pobrać statystyk."));
    } finally {
      setIsLoadingStats(false);
    }
  }, [t]);

  const fetchSortingCenterOrders = useCallback(
    async (page = 0, size = 50) => {
      setIsLoadingOrders(true);
      try {
        const response = await trackPromise(
          api.getOrdersPaged(page, size, "IN_SORTING_CENTER"),
        );
        setSortingCenterOrders(response.data.content || response.data);
      } catch (e) {
        toast.error(
          t("admin.fetchOrdersFail", "Nie udało się pobrać paczek z sortowni."),
        );
      } finally {
        setIsLoadingOrders(false);
      }
    },
    [t],
  );

  return {
    currentAlgorithm,
    fetchAlgorithm,
    changeAlgorithm,
    forceOptimize,
    stats,
    isLoadingStats,
    fetchStats,
    sortingCenterOrders,
    isLoadingOrders,
    fetchSortingCenterOrders,
  };
};
