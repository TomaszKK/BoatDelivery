import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { api } from "@/api/api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { trackPromise } from "react-promise-tracker";
import type { AlgorithmType } from "@/types/RoutingTypes";

export const useAdminRouting = () => {
  const { t } = useTranslation();
  const [currentAlgorithm, setCurrentAlgorithm] =
    useState<AlgorithmType | null>(null);

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

  return {
    currentAlgorithm,
    fetchAlgorithm,
    changeAlgorithm,
    forceOptimize,
  };
};
