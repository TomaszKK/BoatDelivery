import { useLocation, useParams, useNavigate } from "react-router-dom";
import PaymentButton from "@/components/payment/PaymentButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export const PaymentPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { amount, customerEmail } = location.state || {};

  if (!orderId || !amount || !customerEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-red-500 font-bold mb-4">{t("payment.missingData")}</p>
        <button onClick={() => navigate('/mine-orders')} className="text-blue-500 underline">{t("payment.backToOrders")}</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("payment.completePayment")}</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            {t("payment.savedNeedsPayment")}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 w-full p-4 rounded-lg flex justify-between items-center border">
            <span className="font-medium">{t("payment.toPay")}</span>
            <Badge variant="default" className="text-lg px-3 py-1 bg-blue-600">
              {amount.toFixed(2)} PLN
            </Badge>
          </div>

          <PaymentButton
            orderId={orderId}
            amount={amount}
            customerEmail={customerEmail}
          />
        </CardContent>
      </Card>
    </div>
  );
};