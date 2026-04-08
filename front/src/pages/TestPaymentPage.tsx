import React from "react";
import PaymentButton from "@/components/payment/PaymentButton";

const TestPaymentPage: React.FC = () => {
  // Dane testowe
  const testOrderId = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";
  const testAmount = 299.0;
  const testEmail = "test@gmail.com";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-xl font-bold text-slate-800">
          Test Integracji Stripe
        </h1>

        <div className="mb-6 space-y-2 text-sm text-slate-600">
          <p>
            <strong>ID:</strong>{" "}
            <span className="font-mono text-xs">{testOrderId}</span>
          </p>
          <p>
            <strong>Email:</strong> {testEmail}
          </p>
          <p>
            <strong>Kwota:</strong> {testAmount} PLN
          </p>
        </div>

        <PaymentButton
          orderId={testOrderId}
          amount={testAmount}
          customerEmail={testEmail}
        />
      </div>
    </div>
  );
};

export default TestPaymentPage;
