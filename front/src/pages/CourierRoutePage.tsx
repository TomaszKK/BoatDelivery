import { useEffect, useState } from "react";
import { useCourierRoute } from "@/hooks/useCourierRoute";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  Package,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  Map as MapIcon,
} from "lucide-react";
import { RouteMapModal } from "@/components/RouteMapModal";

export const CourierRoutePage = () => {
  const { t } = useTranslation();
  const { routes, fetchRoutes, startRoute, completeStop, finishRoute } =
    useCourierRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const activeRoute = routes.length > 0 ? routes[0] : null;

  const handleStartRoute = async () => {
    if (!activeRoute) return;
    setIsLoading(true);
    await startRoute(activeRoute.id);
    setIsLoading(false);
  };

  const handleCompleteStop = async (stopId: string) => {
    setIsLoading(true);
    await completeStop(stopId);
    setIsLoading(false);
  };

  const handleFinishRoute = async () => {
    if (!activeRoute) return;
    setIsLoading(true);
    await finishRoute(activeRoute.id);
    setIsLoading(false);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "--:--";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!activeRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Navigation className="text-muted-foreground mx-auto h-12 w-12 opacity-50" />
          <h2 className="text-2xl font-bold">{t("courier.noActiveRoute")}</h2>
          <p className="text-muted-foreground">
            {t("courier.noActiveRouteDesc")}
          </p>
        </div>
      </div>
    );
  }

  const isRoutePending = activeRoute.status === "PENDING";
  const isRouteInProgress = activeRoute.status === "IN_PROGRESS";
  const isRouteCompleted = activeRoute.status === "COMPLETED";

  const areAllStopsCompleted = activeRoute.stops.every((stop) => {
    const status = stop.order.status;
    return (
      status === "ORDER_RECEIVED_FROM_CUSTOMER" ||
      status === "DELIVERY_COMPLETED" ||
      status === "IN_SORTING_CENTER"
    );
  });

  return (
    <div className="text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* NAGŁÓWEK TRASY */}
        <div className="border-border/50 flex flex-col gap-6 border-b pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {t("courier.yourRoute")}
              </h2>
              <Badge
                variant="outline"
                className={`${
                  isRouteInProgress
                    ? "border-green-500/20 bg-green-500/10 text-green-600"
                    : isRouteCompleted
                      ? "border-blue-500/20 bg-blue-500/10 text-blue-600"
                      : "bg-primary/10 text-primary border-primary/20"
                } px-3 py-0.5 text-xs font-bold tracking-wider uppercase`}
              >
                {t(`orders.${activeRoute.status}`, activeRoute.status)}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1">
                ID:{" "}
                <span className="text-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  {activeRoute.id.slice(0, 8)}...
                </span>
              </span>
              {activeRoute.totalDistanceKm && (
                <>
                  <span className="opacity-30">|</span>
                  <span className="text-foreground">
                    {activeRoute.totalDistanceKm.toFixed(1)} km
                  </span>
                  <span className="opacity-30">|</span>
                  <span className="text-foreground">
                    {activeRoute.estimatedDurationMin} min
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 self-start md:self-center">
            {/* PRZYCISK: POKAŻ MAPĘ */}
            <Button
              variant="outline"
              onClick={() => setIsMapOpen(true)}
              className="h-10 border-blue-500/20 px-4 transition-colors hover:bg-blue-500/5 hover:text-blue-600"
            >
              <MapIcon className="mr-2 h-4 w-4 text-blue-500" />
              {t("courier.showMap")}
            </Button>

            {/* PRZYCISK: ROZPOCZNIJ TRASĘ */}
            {isRoutePending && (
              <Button
                onClick={handleStartRoute}
                disabled={isLoading}
                className="h-10 bg-green-600 px-6 text-white shadow-lg shadow-green-900/20 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                {t("courier.startRouteAction")}
              </Button>
            )}

            {/* PRZYCISK: ZAKOŃCZ ZMIANĘ */}
            {isRouteInProgress && (
              <Button
                onClick={handleFinishRoute}
                disabled={isLoading || !areAllStopsCompleted}
                variant={areAllStopsCompleted ? "default" : "secondary"}
                className={`h-10 px-6 ${areAllStopsCompleted ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700" : ""}`}
                title={
                  !areAllStopsCompleted ? t("courier.finishRouteDisabled") : ""
                }
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("courier.finishRouteAction")}
              </Button>
            )}
          </div>
        </div>

        {/* LISTA PRZYSTANKÓW (OŚ CZASU) */}
        <Card className="border-border/50 overflow-hidden shadow-sm">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="text-primary h-5 w-5" />
              {t("courier.stopOrder")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            {activeRoute.stops.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center italic">
                {t("courier.emptyRoute")}
              </p>
            ) : (
              <div className="border-muted relative ml-4 space-y-8 border-l-2 pb-6 dark:border-slate-800">
                {activeRoute.stops
                  .sort((a, b) => a.stopSequence - b.stopSequence)
                  .map((stop) => {
                    const order = stop.order;
                    const isPickup = [
                      "CALCULATING_ROUTE_RECEIVE",
                      "ROUTE_ASSIGNED_RECEIVE",
                      "IN_TRANSIT_FOR_PACKAGE",
                    ].includes(order.status);

                    const targetLoc = isPickup
                      ? order.pickupLocation
                      : order.deliveryLocation;

                    const isCompleted = [
                      "ORDER_RECEIVED_FROM_CUSTOMER",
                      "DELIVERY_COMPLETED",
                      "IN_SORTING_CENTER",
                    ].includes(order.status);

                    return (
                      <div
                        key={stop.id}
                        className={`relative pl-8 transition-all duration-300 ${isCompleted ? "opacity-60 grayscale-[0.5]" : "opacity-100"}`}
                      >
                        {/* Kółko na osi czasu */}
                        <span
                          className={`${
                            isCompleted
                              ? "border-green-600 bg-green-600 text-white shadow-sm"
                              : "bg-background border-primary text-primary"
                          } ring-background absolute top-1 -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ring-4 transition-all`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            stop.stopSequence + 1
                          )}
                        </span>

                        {/* Treść przystanku */}
                        <div
                          className={`bg-card flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
                            isCompleted
                              ? "border-green-500/20 bg-green-500/5"
                              : "border-border/50"
                          }`}
                        >
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={isPickup ? "default" : "secondary"}
                                  className={`px-2 py-0 text-[10px] font-bold tracking-tight uppercase ${
                                    !isPickup && !isCompleted
                                      ? "border-red-500/20 bg-red-500/10 text-red-600"
                                      : ""
                                  }`}
                                >
                                  {isPickup
                                    ? t("courier.typePickup")
                                    : t("courier.typeDelivery")}
                                </Badge>
                                {stop.estimatedArrivalTime && (
                                  <span className="text-muted-foreground bg-muted/50 flex items-center rounded-full px-2 py-0.5 text-xs font-bold">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {formatTime(stop.estimatedArrivalTime)}
                                  </span>
                                )}
                              </div>
                              <h4 className="pt-1 text-lg leading-tight font-bold">
                                {targetLoc?.streetAddress ||
                                  t("orders.noAddress")}
                              </h4>
                              <p className="text-muted-foreground text-sm font-medium">
                                {targetLoc?.postalCode} {targetLoc?.city}
                              </p>
                            </div>

                            <Badge
                              variant="outline"
                              className="bg-muted/30 self-start px-2 font-mono text-[11px] tracking-tight"
                            >
                              {order.trackingNumber}
                            </Badge>
                          </div>

                          {/* Stopka karty: Dane paczki + Akcja */}
                          <div className="bg-muted/30 border-border/10 mt-2 flex flex-col justify-between gap-4 rounded-lg border p-3 text-sm sm:flex-row sm:items-center">
                            <div className="text-muted-foreground flex flex-row items-center gap-4 font-bold">
                              <div className="flex items-center gap-1.5">
                                <Package className="text-primary h-4 w-4" />
                                <span>{order.weight} kg</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ArrowRight className="text-primary h-4 w-4" />
                                <span className="text-xs">
                                  {t(`orders.${order.status}`, order.status)}
                                </span>
                              </div>
                            </div>

                            {!isCompleted && isRouteInProgress && (
                              <Button
                                size="sm"
                                className="h-9 w-full bg-green-600 px-4 font-bold text-white transition-all hover:bg-green-700 sm:w-auto"
                                onClick={() => handleCompleteStop(stop.id)}
                                disabled={isLoading}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {isPickup
                                  ? t("courier.markCollected")
                                  : t("courier.markDelivered")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MODAL Z MAPĄ DROGOWĄ */}
      <RouteMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        route={activeRoute}
      />
    </div>
  );
};
