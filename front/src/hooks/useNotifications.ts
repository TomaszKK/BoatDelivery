import { useEffect } from "react";
import { toast } from "sonner";

export const useNotifications = () => {
  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/api/notifications/stream",
    );

    eventSource.addEventListener("order-update", (event) => {
      toast.info("Aktualizacja z systemu", {
        description: event.data,
        duration: 5000, // Czas znikania powiadomienia
      });
    });

    eventSource.onerror = (error) => {
      console.error("Błąd kanału SSE:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
};
