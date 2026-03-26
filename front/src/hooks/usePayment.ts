import { useState } from 'react';
import { createPaymentSession } from '@/api/paymentApi';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (orderId: string, amount: number, customerEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await createPaymentSession(orderId, amount, customerEmail);

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Brak linku do płatności w odpowiedzi.");
      }
    } catch (err) {
      console.error("Błąd inicjacji płatności:", err);
      setError("Nie udało się rozpocząć płatności. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return { initiatePayment, isLoading, error };
};