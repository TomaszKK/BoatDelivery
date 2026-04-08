import { useTransport } from "@/hooks/useTransport";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@/components/ui/loaderComponent";
import { AlertCircle, Truck, Fuel, Weight, Package, Palette, Gauge, Zap } from "lucide-react";
import { TransportType } from "@/types/TransportType";

const getTransportTypeLabel = (type: TransportType, t: any): string => {
  const labels: Record<TransportType, string> = {
    [TransportType.CAR]: t("transport.transportTypes.CAR"),
    [TransportType.VAN]: t("transport.transportTypes.VAN"),
    [TransportType.TRUCK]: t("transport.transportTypes.TRUCK"),
    [TransportType.BIKE]: t("transport.transportTypes.BIKE"),
    [TransportType.BOAT]: t("transport.transportTypes.BOAT"),
  };
  return labels[type] || type;
};

const getFuelTypeLabel = (fuelType: string | undefined, t: any): string => {
  if (!fuelType) return "—";
  const labels: Record<string, string> = {
    PETROL: t("transport.fuelTypes.PETROL"),
    DIESEL: t("transport.fuelTypes.DIESEL"),
    ELECTRIC: t("transport.fuelTypes.ELECTRIC"),
    HYBRID: t("transport.fuelTypes.HYBRID"),
    LPG: t("transport.fuelTypes.LPG"),
  };
  return labels[fuelType] || fuelType;
};

export const CourierTransportTab = () => {
  const { transport, loading, error } = useTransport();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!transport) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 dark:bg-slate-900">
        <Truck className="mb-3 h-12 w-12 text-gray-400" />
        <p className="text-center text-gray-600 dark:text-gray-300">
          {t("transport.noVehicle")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">

        <div className="grid gap-6 md:grid-cols-2">
          {/* Typ i Marka */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Truck className="h-4 w-4" />
              {t("transport.type")}
            </label>
            <p className="text-lg font-medium">
              {getTransportTypeLabel(transport.transportType, t)}
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="h-4 w-4" />
              {t("transport.brand")}
            </label>
            <p className="text-lg font-medium">{transport.brand || "—"}</p>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Gauge className="h-4 w-4" />
              {t("transport.model")}
            </label>
            <p className="text-lg font-medium">{transport.model || "—"}</p>
          </div>

          {/* Tablica rejestracyjna */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="h-4 w-4" />
              {t("transport.licensePlate")}
            </label>
            <p className="font-mono text-lg font-bold">
              {transport.licensePlate || "—"}
            </p>
          </div>

          {/* Kolor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Palette className="h-4 w-4" />
              {t("transport.color")}
            </label>
            <div className="flex items-center gap-3">
              {transport.color && (
                <div
                  className="h-8 w-8 rounded border border-gray-300"
                  style={{ backgroundColor: transport.color }}
                />
              )}
              <p className="text-lg font-medium">{transport.color || "—"}</p>
            </div>
          </div>

          {/* Typ paliwa */}
          {transport.fuelType && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Fuel className="h-4 w-4" />
                {t("transport.fuelType")}
              </label>
              <p className="text-lg font-medium">{getFuelTypeLabel(transport.fuelType, t)}</p>
            </div>
          )}

          {/* Pojemność palinika */}
          {transport.trunkVolume && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Package className="h-4 w-4" />
                {t("transport.trunkVolume")}
              </label>
              <p className="text-lg font-medium">{transport.trunkVolume} L</p>
            </div>
          )}

          {/* Ładowność */}
          {transport.cargoCapacity && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Weight className="h-4 w-4" />
                {t("transport.cargoCapacity")}
              </label>
              <p className="text-lg font-medium">{transport.cargoCapacity} kg</p>
            </div>
          )}

          {/* Spalanie */}
          {transport.consumption && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Gauge className="h-4 w-4" />
                {t("transport.consumption")}
              </label>
              <p className="text-lg font-medium">{transport.consumption} L/100km</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

