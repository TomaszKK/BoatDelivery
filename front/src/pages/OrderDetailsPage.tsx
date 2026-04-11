import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrder } from "@/hooks/useOrder";
import { getCountryMap } from "@/utils/countries";
import MapComponent from "@/components/MapComponent";
import type { OrderStatus } from "@/types/OrderType";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Package,
  MapPin,
  Flag,
  Clock,
  ArrowLeft,
  Check,
  X,
  User,
  Phone,
  Mail
} from "lucide-react";

const STATUS_FLOW: OrderStatus[] = [
  "ORDER_CREATED",
  "CALCULATING_ROUTE_RECEIVE",
  "ROUTE_ASSIGNED_RECEIVE",
  "IN_TRANSIT_FOR_PACKAGE",
  "ORDER_RECEIVED_FROM_CUSTOMER",
  "IN_SORTING_CENTER",
  "CALCULATING_ROUTE_DELIVERY",
  "ROUTE_ASSIGNED_DELIVERY",
  "IN_TRANSIT_TO_CUSTOMER",
  "DELIVERY_COMPLETED",
];

export const OrderDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { trackingNumber } = useParams<{ trackingNumber: string }>();

  const countiresMap = useMemo(() => {
    return getCountryMap(i18n.language);
  }, [i18n.language]);

  const { getOrderByTrackingNumber, order } = useOrder();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!trackingNumber) return;
      try {
        await getOrderByTrackingNumber(trackingNumber);
      } catch (error) {
        console.error("There was an error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [trackingNumber]);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold">{t("orders.notFound")}</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          {t("back")}
        </Button>
      </div>
    );
  }

  const isCanceled = order.status === "ORDER_CANCELED";
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status as OrderStatus);

  return (
    <div className="min-h-screen p-6 text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                {t("orders.details")}
              </h2>
              <p className="text-muted-foreground font-mono text-sm">
                {order.trackingNumber}
              </p>
            </div>
          </div>

          <Badge
            variant={isCanceled ? "destructive" : "default"}
            className={`px-4 py-1.5 text-sm ${
              !isCanceled && order.status === "DELIVERY_COMPLETED"
                ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                : !isCanceled
                  ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  : ""
            }`}
          >
            {t(`orders.${order.status}`)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEWA KOLUMNA */}
          <div className="flex flex-col gap-6">
            
            {/* Informacje o paczce */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="text-muted-foreground h-5 w-5" />
                  {t("orders.packageInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2 dark:border-slate-800">
                  <span className="text-muted-foreground">
                    {t("orders.weight")}
                  </span>
                  <span className="font-medium">{order.weight} kg</span>
                </div>
                <div className="flex justify-between border-b pb-2 dark:border-slate-800">
                  <span className="text-muted-foreground">
                    {t("orders.volume")}
                  </span>
                  <span className="font-medium">{order.volume} m³</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">
                    {t("orders.created")}
                  </span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* DANE ODBIORCY - NOWA KARTA */}
            {order.recipientFirstName && (
              <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-500">
                    <User className="h-5 w-5" />
                    {t("orders.recipientData", "Dane Odbiorcy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-emerald-600/60" />
                    <span className="font-bold text-base">{order.recipientFirstName} {order.recipientLastName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-emerald-600/60" />
                    <span className="font-mono">{order.recipientPhone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-emerald-600/60" />
                    <span>{order.recipientEmail}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <MapComponent
              pickupLocation={order.pickupLocation}
              deliveryLocation={order.deliveryLocation}
            />
          </div>

          {/* PRAWA KOLUMNA */}
          <div className="flex flex-col gap-6">
            {/* Adresy */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1">
              {/* Pickup */}
              {order.pickupLocation && (
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {t("orders.pickup")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="font-medium">
                      {order.pickupLocation.streetAddress}
                    </p>
                    <p className="text-muted-foreground">
                      {order.pickupLocation.postalCode}{" "}
                      {order.pickupLocation.city}
                    </p>
                    <p className="text-muted-foreground/70 mt-1 text-xs">
                      {countiresMap.get(order.pickupLocation.country) ||
                        order.pickupLocation.country}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Delivery */}
              {order.deliveryLocation && (
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Flag className="h-4 w-4 text-red-500" />
                      {t("orders.delivery")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="font-medium">
                      {order.deliveryLocation.streetAddress}
                    </p>
                    <p className="text-muted-foreground">
                      {order.deliveryLocation.postalCode}{" "}
                      {order.deliveryLocation.city}
                    </p>
                    <p className="text-muted-foreground/70 mt-1 text-xs">
                      {countiresMap.get(order.deliveryLocation.country) ||
                        order.deliveryLocation.country}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* OŚ CZASU (TIMELINE) */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="text-muted-foreground h-5 w-5" />
                  {t("orders.trackingHistory", "Status przesyłki")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-muted relative ml-3 space-y-6 border-l-2 dark:border-slate-800">
                  {isCanceled ? (
                    <div className="relative pl-6">
                      <span className="bg-destructive ring-background absolute top-1 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full ring-4">
                        <X className="text-destructive-foreground h-3 w-3" />
                      </span>
                      <h4 className="text-destructive text-sm font-bold">
                        {t("orders.ORDER_CANCELED")}
                      </h4>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {t(
                          "orders.orderWasCanceled",
                          "Zamówienie zostało anulowane.",
                        )}
                      </p>
                    </div>
                  ) : (
                    STATUS_FLOW.map((statusItem, index) => {
                      const isCompleted = index < currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isPending = index > currentStatusIndex;

                      return (
                        <div
                          key={statusItem}
                          className={`relative pl-6 ${isPending ? "opacity-40" : ""}`}
                        >
                          <span
                            className={`ring-background absolute top-1 -left-[11px] flex h-5 w-5 items-center justify-center rounded-full ring-4 ${isCompleted ? "bg-green-500" : ""} ${isCurrent ? "bg-blue-500" : ""} ${isPending ? "bg-muted" : ""} `}
                          >
                            {isCompleted && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                            {isCurrent && (
                              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                            )}
                          </span>

                          <h4
                            className={`text-sm font-medium ${isCurrent ? "text-blue-500 dark:text-blue-400" : ""}`}
                          >
                            {t(`orders.${statusItem}`)}
                          </h4>

                          {isCurrent && (
                            <p className="mt-1 animate-pulse text-xs text-blue-500/80">
                              {t("orders.inProgress", "W trakcie...")}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};