import React from "react";
import { usePayment } from "@/hooks/usePayment";
import { useTranslation } from "react-i18next";

interface PaymentButtonProps {
  orderId: string;
  amount: number;
  customerEmail: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
                                                       orderId,
                                                       amount,
                                                       customerEmail,
                                                     }) => {
  const { initiatePayment, isLoading, error } = usePayment();
  const { t } = useTranslation();

  const handleClick = () => {
    initiatePayment(orderId, amount, customerEmail);
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={isLoading || !orderId}
        className={`rounded-lg px-8 py-3 font-bold text-white shadow-md transition-all ${
          isLoading || !orderId
            ? "cursor-not-allowed bg-slate-400"
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
        }`}
      >
        {isLoading
          ? t("payment.processing")
          : t("payment.payAmount", { amount: amount.toFixed(2) })}
      </button>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default PaymentButton;