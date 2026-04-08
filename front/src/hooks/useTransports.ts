import { useState, useEffect } from "react";
import { api } from "@/api/api";
import type { Transport } from "@/types/TransportType";
import type { User } from "@/types/UserType";

export const useTransports = () => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllTransports();
      setTransports(response.data || []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się pobrać pojazów";
      setError(errorMessage);
      setTransports([]);
      console.error("Error fetching transports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  const deleteTransport = async (transportId: string) => {
    try {
      await api.deleteTransport(transportId);
      await fetchTransports();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć pojazdu";
      console.error("Error deleting transport:", err);
      return { success: false, error: errorMessage };
    }
  };

  const createTransport = async (courierId: string, data: any) => {
    try {
      const response = await api.createTransport(courierId, data);
      await fetchTransports();
      return { success: true, data: response.data };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się dodać pojazdu";
      console.error("Error creating transport:", err);
      return { success: false, error: errorMessage };
    }
  };

  const updateTransport = async (transportId: string, data: any) => {
    try {
      const response = await api.updateTransport(transportId, data);
      await fetchTransports();
      return { success: true, data: response.data };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować pojazdu";
      console.error("Error updating transport:", err);
      return { success: false, error: errorMessage };
    }
  };

  return {
    transports,
    loading,
    error,
    deleteTransport,
    createTransport,
    updateTransport,
    refetch: fetchTransports,
  };
};

