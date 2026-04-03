import { useEffect, useState } from "react";
import { useCourierRoute } from "@/hooks/useCourierRoute";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Package, ArrowRight, Play, CheckCircle2, Clock } from "lucide-react";

export const CourierRoutePage = () => {
  const { t } = useTranslation();
  const { routes, fetchRoutes, startRoute, completeStop, finishRoute } = useCourierRoute();
  const [isLoading, setIsLoading] = useState(false);

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

  // Helper do formatowania czasu przyjazdu
  const formatTime = (timeString?: string) => {
    if (!timeString) return "--:--";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!activeRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Navigation className="text-muted-foreground mx-auto h-12 w-12 opacity-50" />
          <h2 className="text-2xl font-bold">{t("courier.noActiveRoute", "Brak aktywnej trasy")}</h2>
          <p className="text-muted-foreground">
            {t("courier.noActiveRouteDesc", "Obecnie nie masz przypisanej żadnej trasy do realizacji.")}
          </p>
        </div>
      </div>
    );
  }

  const isRoutePending = activeRoute.status === "PENDING";
  const isRouteInProgress = activeRoute.status === "IN_PROGRESS";
  const isRouteCompleted = activeRoute.status === "COMPLETED";

  // NOWE: Sprawdzamy czy kurier "odklikał" wszystkie przystanki
  const areAllStopsCompleted = activeRoute.stops.every((stop) => {
    const status = stop.order.status;
    return status === "ORDER_RECEIVED_FROM_CUSTOMER" || 
           status === "DELIVERY_COMPLETED" || 
           status === "IN_SORTING_CENTER";
  });

  return (
    <div className="text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        
        {/* NAGŁÓWEK TRASY */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t("courier.yourRoute", "Twoja Trasa")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("courier.routeId", "ID Trasy")}:{" "}
              <span className="font-mono text-xs">{activeRoute.id}</span>
            </p>
            {activeRoute.totalDistanceKm && (
               <p className="text-muted-foreground text-sm mt-1">
                 Suma: <span className="font-medium text-foreground">{activeRoute.totalDistanceKm.toFixed(1)} km</span>
                 {" • "}
                 Czas: <span className="font-medium text-foreground">{activeRoute.estimatedDurationMin} min</span>
               </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
             {/* PRZYCISK: ROZPOCZNIJ TRASĘ */}
             {isRoutePending && (
                <Button 
                   onClick={handleStartRoute} 
                   disabled={isLoading}
                   className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                   <Play className="w-4 h-4 mr-2" /> 
                   {t("courier.startRouteAction", "Rozpocznij trasę")}
                </Button>
             )}

             {/* PRZYCISK: ZAKOŃCZ ZMIANĘ */}
             {isRouteInProgress && (
                <Button 
                   onClick={handleFinishRoute} 
                   disabled={isLoading || !areAllStopsCompleted} // <-- BLOKADA NA FRONCIE
                   variant={areAllStopsCompleted ? "default" : "secondary"}
                   className="shadow-md"
                   title={!areAllStopsCompleted ? t("courier.finishRouteDisabled", "Musisz obsłużyć wszystkie paczki przed zakończeniem zmiany") : ""}
                >
                   <CheckCircle2 className="w-4 h-4 mr-2" /> 
                   {t("courier.finishRouteAction", "Zakończ Zmianę")}
                </Button>
             )}
             
            {/* STATUS TRASY */}
            <Badge
              variant="outline"
              className={`${
                isRouteInProgress ? "bg-green-500/10 text-green-600 border-green-500/20" :
                isRouteCompleted ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                "bg-primary/10 text-primary border-primary/20"
              } w-fit px-4 py-1.5 text-sm uppercase tracking-wider`}
            >
              {t(`orders.${activeRoute.status}`, activeRoute.status)}
            </Badge>
          </div>
        </div>

        {/* LISTA PRZYSTANKÓW (OŚ CZASU) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/20 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="text-primary h-5 w-5" />
              {t("courier.stopOrder")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {activeRoute.stops.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                {t("courier.emptyRoute", "Trasa jest pusta.")}
              </p>
            ) : (
              <div className="border-muted relative ml-4 space-y-8 border-l-2 pb-4 dark:border-slate-800">
                {activeRoute.stops.map((stop) => {
                  const order = stop.order;
                  // Zależnie od statusu, wyświetlamy adres nadawcy (odbieramy paczkę) lub odbiorcy (doręczamy paczkę)
                  const isPickup = order.status === "CALCULATING_ROUTE_RECEIVE" || order.status === "ROUTE_ASSIGNED_RECEIVE" || order.status === "IN_TRANSIT_FOR_PACKAGE";
                  const targetLoc = isPickup ? order.pickupLocation : order.deliveryLocation;
                  
                  // Czy to konkretne zamówienie jest w statusie końcowym na tę chwilę?
                  const isCompleted = order.status === "ORDER_RECEIVED_FROM_CUSTOMER" || order.status === "DELIVERY_COMPLETED" || order.status === "IN_SORTING_CENTER";

                  return (
                    <div key={stop.id} className={`relative pl-8 transition-opacity duration-300 ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                      
                      {/* OŚ CZASU: Numer przystanku */}
                      <span className={`${
                        isCompleted ? "bg-green-100 border-green-600 text-green-600 dark:bg-green-900/30" : "bg-background border-primary text-primary"
                      } ring-background absolute top-1 -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ring-4`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stop.stopSequence + 1}
                      </span>

                      {/* KARTA PRZYSTANKU */}
                      <div className={`bg-card flex flex-col gap-3 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md ${isCompleted ? "border-green-500/30" : "border-border/50"}`}>
                        
                        {/* Góra: Adres i Tracking */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                               <Badge variant={isPickup ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                                  {isPickup ? t("courier.typePickup") : t("courier.typeDelivery")}
                               </Badge>
                               {stop.estimatedArrivalTime && (
                                  <span className="flex items-center text-xs text-muted-foreground font-medium">
                                     <Clock className="w-3.5 h-3.5 mr-1" />
                                     {formatTime(stop.estimatedArrivalTime)}
                                  </span>
                               )}
                            </div>
                            <h4 className="text-lg leading-tight font-semibold">
                              {targetLoc?.streetAddress || t("orders.noAddress")}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              {targetLoc?.postalCode} {targetLoc?.city}
                            </p>
                          </div>
                          
                          <Badge variant="outline" className="font-mono bg-muted/30 whitespace-nowrap self-start">
                            {order.trackingNumber}
                          </Badge>
                        </div>

                        {/* Dół: Szczegóły i Akcje */}
                        <div className="bg-muted/40 mt-1 flex flex-col sm:flex-row sm:items-center justify-between rounded-md p-3 text-sm gap-4">
                           <div className="flex flex-row items-center gap-4 text-muted-foreground font-medium">
                              <div className="flex items-center gap-1.5">
                                <Package className="h-4 w-4" />
                                <span>{order.weight} kg</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ArrowRight className="h-4 w-4" />
                                <span>{t(`orders.${order.status}`, order.status)}</span>
                              </div>
                           </div>
                           
                           {/* PRZYCISK: OZNACZ JAKO ZAKOŃCZONE (Widoczny tylko jeśli trasa IN_PROGRESS) */}
                           {!isCompleted && isRouteInProgress && (
                              <Button 
                                size="sm" 
                                className="bg-green-600/10 text-green-700 hover:bg-green-600 hover:text-white border border-green-600/20 transition-colors w-full sm:w-auto"
                                onClick={() => handleCompleteStop(stop.id)}
                                disabled={isLoading}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2"/>
                                {isPickup ? t("courier.markCollected") : t("courier.markDelivered")}
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
    </div>
  );
};