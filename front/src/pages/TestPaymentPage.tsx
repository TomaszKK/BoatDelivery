import React from 'react';
import PaymentButton from '@/components/payment/PaymentButton';

const TestPaymentPage: React.FC = () => {
  // Dane testowe
  const testOrderId = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";
  const testAmount = 299.00;
  const testEmail = "test@gmail.com";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="p-8 max-w-sm w-full bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-xl font-bold mb-4 text-slate-800">Test Integracji Stripe</h1>

        <div className="text-sm text-slate-600 mb-6 space-y-2">
          <p><strong>ID:</strong> <span className="font-mono text-xs">{testOrderId}</span></p>
          <p><strong>Email:</strong> {testEmail}</p>
          <p><strong>Kwota:</strong> {testAmount} PLN</p>
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