import { useEffect, useState, useCallback } from "react";
import { apiForAuthenticated } from "@/api/api.config";
import type { Transport } from "@/types/TransportType";

interface UseTransportState {
  transport: Transport | null;
  loading: boolean;
  error: string | null;
}

export const useTransport = () => {
  const [state, setState] = useState<UseTransportState>({
    transport: null,
    loading: false,
    error: null,
  });

  const fetchTransport = useCallback(async () => {
    setState({ transport: null, loading: true, error: null });
    try {
      const response =
        await apiForAuthenticated.get<Transport>("/transport/my");
      setState({
        transport: response.data || null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      if (error.response?.status === 204 || error.response?.status === 404) {
        setState({ transport: null, loading: false, error: null });
        return;
      }
      console.error("Error fetching transport:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Błąd podczas pobierania danych pojazdu";
      setState({ transport: null, loading: false, error: errorMessage });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchTransport()
      .then(() => {
        if (!isMounted) return;
      })
      .catch((error) => {
        console.error("Error in fetchTransport:", error);
        if (isMounted) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Błąd podczas pobierania danych pojazdu";
          setState({ transport: null, loading: false, error: errorMessage });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...state, refetch: fetchTransport };
};
