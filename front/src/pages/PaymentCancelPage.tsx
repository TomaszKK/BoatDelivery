import { useTranslation } from "react-i18next";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pathnames } from "@/router/pathnames";

export const PaymentCancelPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <XCircle className="mb-6 h-20 w-20 text-red-500" strokeWidth={1.5} />
      <h1 className="mb-2 text-3xl font-bold text-red-500">
        {t("payment.cancelTitle", "Płatność anulowana")}
      </h1>
      <p className="text-muted-foreground mb-8 text-lg">
        {t("payment.cancelDesc", "Twoje zamówienie nie zostało opłacone.")}
      </p>
      <Button 
        onClick={() => navigate(Pathnames.customer["mine-orders"])}
        variant="outline"
        size="lg"
      >
        {t("payment.backToOrders", "Wróć do zamówień")}
      </Button>
    </div>
  );
};