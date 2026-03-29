import React from 'react';
import { usePayment } from '@/hooks/usePayment';

interface PaymentButtonProps {
  orderId: string;
  amount: number;
  customerEmail: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ orderId, amount, customerEmail }) => {
  const { initiatePayment, isLoading, error } = usePayment();

  const handleClick = () => {
    initiatePayment(orderId, amount, customerEmail);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={handleClick}
        disabled={isLoading || !orderId}
        className={`px-8 py-3 text-white font-bold rounded-lg shadow-md transition-all 
          ${isLoading || !orderId
          ? 'bg-slate-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
      >
        {isLoading ? 'Przetwarzanie...' : `Zapłać ${amount} PLN`}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
      )}
    </div>
  );
};

export default PaymentButton;