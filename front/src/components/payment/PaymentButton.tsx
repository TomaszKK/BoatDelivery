import React, { useState } from 'react';
import axios from 'axios';
// import { Button } from "@/components/ui/button";

// Wymagane dane z formularza zamowienia
interface PaymentButtonProps {
  orderId: string;
  amount: number;
  customerEmail: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ orderId, amount, customerEmail }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8084/api/payments/create-session', {
        orderId,
        amount,
        customerEmail
      });

      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("Brak linku do płatności w odpowiedzi z serwera.");
      }
    } catch (err) {
      console.error("Błąd inicjacji płatności:", err);
      setError("Nie udało się rozpocząć płatności. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Używamy standardowego HTML z Tailwindem, żeby nie popsuć designu kolegi */}
      <button
        onClick={handlePayment}
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