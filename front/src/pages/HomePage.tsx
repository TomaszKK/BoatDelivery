import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Ship,
  Map,
  LayoutDashboard,
  Search,
  Loader2,
  Package,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { TrackedOrder } from "@/types/OrderType";
import { useOrder } from "@/hooks/useOrder";

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const { getMininalizedOrderByTrackingNumber } = useOrder();

  const handleTrackPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setTrackedOrder(null);

    try {
      const data = await getMininalizedOrderByTrackingNumber(
        trackingNumber.trim(),
      );
      setTrackedOrder(data as TrackedOrder);
    } catch (error: any) {
      toast.error(t("home.trackingFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center space-y-12 p-6 text-center">
      {/* SEKCJA HERO */}
      <div className="mt-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          {t("home.welcomeTo")}{" "}
          <span className="text-primary">BoatDelivery</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {t("home.heroDescription")}
        </p>
      </div>

      {/* WIDŻET ŚLEDZENIA PACZEK */}
      <div className="bg-card border-border/50 mx-auto w-full max-w-xl rounded-2xl border p-2 shadow-lg">
        <form onSubmit={handleTrackPackage} className="flex gap-2">
          <div className="relative flex-1">
            <Package className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder={t("home.enterTracking")}
              className="h-14 border-none bg-transparent pl-10 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !trackingNumber.trim()}
            className="h-14 rounded-xl bg-blue-600 px-8 text-lg text-white transition-all hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            {t("home.trackButton")}
          </Button>
        </form>
      </div>

      {/* WYNIK WYSZUKIWANIA PACZKI */}
      {trackedOrder && (
        <div className="animate-in slide-in-from-bottom-4 fade-in w-full max-w-xl duration-300">
          <Card className="border-blue-500/30 bg-blue-500/5 shadow-md">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
              <div className="text-left">
                <p className="text-muted-foreground mb-1 text-sm font-medium">
                  {t("home.packageStatus")}:{" "}
                  <span className="text-foreground font-mono">
                    {trackedOrder.trackingNumber}
                  </span>
                </p>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <ArrowRight className="h-5 w-5 text-blue-500" />
                  {t(`orders.${trackedOrder.status}`, trackedOrder.status)}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  ({trackedOrder.weight} kg)
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/tracking/${trackedOrder.trackingNumber}`)
                }
              >
                {t("home.routeDetails")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEKCJA KART */}
      <div className="grid w-full gap-6 pt-8 pb-12 md:grid-cols-3">
        <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
          <CardHeader className="pb-2 text-center">
            <Ship className="mx-auto mb-2 h-12 w-12 text-blue-500" />
            <CardTitle className="text-lg">
              {t("home.cardCreateOrders")}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
          <CardHeader className="pb-2 text-center">
            <Map className="mx-auto mb-2 h-12 w-12 text-red-500" />
            <CardTitle className="text-lg">
              {t("home.cardTrackRealtime")}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
          <CardHeader className="pb-2 text-center">
            <LayoutDashboard className="mx-auto mb-2 h-12 w-12 text-indigo-500" />
            <CardTitle className="text-lg">
              {t("home.cardManageRoutes")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
