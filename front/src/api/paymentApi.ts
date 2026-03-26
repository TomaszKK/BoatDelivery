import axios from 'axios';

interface PaymentSessionResponse {
  checkoutUrl: string;
}

export const createPaymentSession = async (orderId: string, amount: number, customerEmail: string): Promise<PaymentSessionResponse> => {
  const response = await axios.post<PaymentSessionResponse>('http://localhost:8084/api/payments/create-session', {
    orderId,
    amount,
    customerEmail
  });
  return response.data;
};