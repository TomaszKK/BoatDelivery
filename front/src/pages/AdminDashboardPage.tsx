import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAdminRouting } from "@/hooks/useAdminRouting";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PackageSearch, 
  Warehouse, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertOctagon, 
  MapPin, 
  Map,
  PackageCheck
} from "lucide-react";
import type { OrderStatus } from "@/types/OrderType";

// Konfiguracja kolorów i ikon
const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "WAITING_FOR_PAYMENT": return { color: "bg-yellow-500", icon: Clock };
    case "ORDER_CREATED": return { color: "bg-blue-500", icon: PackageSearch };
    case "CALCULATING_ROUTE_RECEIVE": return { color: "bg-indigo-500", icon: Map };
    case "ROUTE_ASSIGNED_RECEIVE": return { color: "bg-indigo-600", icon: MapPin };
    case "IN_TRANSIT_FOR_PACKAGE": return { color: "bg-orange-500", icon: Truck };
    case "ORDER_RECEIVED_FROM_CUSTOMER": return { color: "bg-teal-500", icon: PackageCheck };
    case "IN_SORTING_CENTER": return { color: "bg-teal-600", icon: Warehouse };
    case "CALCULATING_ROUTE_DELIVERY": return { color: "bg-purple-500", icon: Map };
    case "ROUTE_ASSIGNED_DELIVERY": return { color: "bg-purple-600", icon: MapPin };
    case "IN_TRANSIT_TO_CUSTOMER": return { color: "bg-orange-600", icon: Truck };
    case "DELIVERY_COMPLETED": return { color: "bg-green-600", icon: CheckCircle2 };
    case "ORDER_CANCELED": return { color: "bg-red-600", icon: AlertOctagon };
    default: return { color: "bg-slate-500", icon: PackageSearch };
  }
};

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { stats, fetchStats, isLoadingStats } = useAdminRouting();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Tablica gwarantująca logiczną kolejność wyświetlania na ekranie
  const allStatuses: OrderStatus[] = [
    "WAITING_FOR_PAYMENT",
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
    "ORDER_CANCELED"
  ];

  return (
    <div className="text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* HEADER */}
        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("admin.dashboardTitle")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("admin.dashboardDesc")}
          </p>
        </div>

        {/* GRID ZE STATUSAMI */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allStatuses.map((status) => {
            const config = getStatusConfig(status);
            const Icon = config.icon;
            
            // Pobieramy wartość. Backend gwarantuje nam zera dla pustych statusów, ale na wszelki wypadek dajemy fallback.
            const count = stats && stats[status] !== undefined ? stats[status] : 0;

            return (
              <Card key={status} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1 pr-2">
                    <CardTitle className="text-sm font-semibold text-slate-700 h-10 leading-tight line-clamp-2">
                      {/* Magia i18n - tłumaczymy statusy! */}
                      {t(`status.${status}`)}
                    </CardTitle>
                  </div>
                  <div className={`${config.color} p-2 rounded-lg text-white shadow-sm shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">
                    {isLoadingStats ? "..." : count}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
};