import { useState } from 'react';
import { api } from '@/api/api';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (orderId: string, amount: number, customerEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.createPaymentSession(orderId, amount, customerEmail);

      if (response.data && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
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