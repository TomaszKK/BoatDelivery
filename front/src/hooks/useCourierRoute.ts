import { useState, useCallback } from "react";
import { api } from "@/api/api";
import { toast } from "sonner";
import { trackPromise } from "react-promise-tracker";
import type { RouteResponseDTO } from "@/types/RoutingTypes";
import { useTranslation } from "react-i18next";

export const useCourierRoute = () => {
  const [routes, setRoutes] = useState<RouteResponseDTO[]>([]);
  const {t} = useTranslation();

  const fetchRoutes = useCallback(async () => {
    try {
      const response = await trackPromise(api.getRoutes());
      setRoutes(response.data);
    } catch (e) {
      toast.error(t("courier.fetchRoutesError"));
    }
  }, []);

  const startRoute = useCallback(async (routeId: string) => {
    try {
      await trackPromise(api.startRoute(routeId));
      toast.success(t("courier.routeStartedSuccess"));
      fetchRoutes();  
    } catch (e) {
      toast.error(t("courier.startRouteError"));
    }
  }, [fetchRoutes]);

  const completeStop = useCallback(async (stopId: string) => {
    try {
      await trackPromise(api.completeStop(stopId));
      toast.success(t("courier.stopCompletedSuccess"));
      fetchRoutes();
    } catch (e) {
      toast.error(t("courier.completeStopError"));
    }
  }, [fetchRoutes]);

const finishRoute = useCallback(async (routeId: string) => {
    try {
      await trackPromise(api.finishRoute(routeId));
      toast.success(t("courier.routeFinishedSuccess", "Zakończono zmianę. Paczki przekazane do sortowni."));
      fetchRoutes();  
    } catch (e: any) {
      toast.error(e.response?.data?.error || t("courier.finishRouteError", "Błąd przy kończeniu trasy"));
    }
  }, [fetchRoutes, t]);

  return {
    routes,
    fetchRoutes,
    startRoute,
    completeStop,
    finishRoute,
  };
};
