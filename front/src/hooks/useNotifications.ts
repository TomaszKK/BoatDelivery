import { useEffect } from "react";
import { toast } from "sonner";
import i18n from "i18next";

export const useNotifications = () => {
  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/api/notifications/stream",
    );

    eventSource.addEventListener("order-update", (event) => {
      try {
        const payload = JSON.parse(event.data);


        toast.info(i18n.t(`sse.titles.${payload.type}`, "Powiadomienie systemowe"), {
          description: i18n.t(`sse.messages.${payload.type}`, { data: payload.data }),
          duration: 5000,
        });
      } catch (error) {
        console.error("Błąd dekodowania JSON z SSE:", error);
      }
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