export interface EmailLog {
  id: string;
  trackingNumber: string;
  recipientEmail: string;
  status: string;
  messageContent: string;
  errorMessage: string | null;
  createdAt: string;
}

export interface SmsLog {
  id: string;
  trackingNumber: string;
  recipientNumber: string;
  status: string;
  messageContent: string;
  errorMessage: string | null;
  createdAt: string;
}