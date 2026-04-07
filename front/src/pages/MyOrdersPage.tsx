import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOrder } from "@/hooks/useOrder";
import { OrderFormModal } from "@/components/OrderFormModal";
import { useNavigate } from "react-router-dom";

// Importy komponentów Shadcn UI
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Importy ikon Lucide
import { Plus, Package, MapPin, Calendar, Inbox } from "lucide-react";

export const MyOrdersPage = () => {
  const { t } = useTranslation();
  const { orders, getAllOrders } = useOrder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("orders.yourOrders")}
          </h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            {t("orders.newOrder")}
          </Button>
        </div>

        {/* WIDOK BRAKU ZAMÓWIEŃ */}
        {!orders || orders.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border-dashed p-12 text-center shadow-sm">
            <Inbox className="text-muted-foreground/50 mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-lg font-medium">
              {t("orders.noOrders")}
            </p>
          </Card>
        ) : (
          /* LISTA ZAMÓWIEŃ */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {orders.map((o) => {
              const isCanceled = o.status === "ORDER_CANCELED";
              const isCompleted = o.status === "DELIVERY_COMPLETED";

              return (
                <Card
                  key={o.trackingNumber}
                  onClick={() => navigate(`/orders/${o.trackingNumber}`)}
                  className="hover:border-primary/40 cursor-pointer transition-all hover:shadow-md"
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-primary font-mono text-lg font-bold">
                      {o.trackingNumber}
                    </CardTitle>
                    <Badge
                      variant={isCanceled ? "destructive" : "default"}
                      className={`px-3 py-0.5 text-xs ${
                        !isCanceled && isCompleted
                          ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                          : !isCanceled
                            ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                            : ""
                      }`}
                    >
                      {t(`orders.${o.status}`)}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4" />
                      <span>
                        {t("orders.weightInfo")}{" "}
                        <span className="text-foreground font-medium">
                          {o.weight} kg
                        </span>
                      </span>
                    </div>

                    {o.deliveryLocation && (
                      <div className="text-muted-foreground flex items-start gap-2 text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="leading-tight">
                          {t("orders.to")}{" "}
                          <span className="text-foreground font-medium">
                            {o.deliveryLocation.city},{" "}
                            {o.deliveryLocation.streetAddress}
                          </span>
                        </span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="text-muted-foreground border-t pt-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {t("orders.created")}{" "}
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <OrderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
