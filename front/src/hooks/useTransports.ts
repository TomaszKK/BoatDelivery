import { useState, useEffect } from "react";
import { api } from "@/api/api";
import type { Transport } from "@/types/TransportType";

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
          : "Nie udało się pobrać listy pojazdów";
      setError(errorMessage);
      console.error("Error fetching transports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  const createTransport = async (transportData: any) => {
    try {
      const response = await api.createTransport(transportData);
      await fetchTransports();
      return { success: true, data: response.data };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się utworzyć pojazdu";
      console.error("Error creating transport:", err);
      return { success: false, error: errorMessage };
    }
  };

  const updateTransport = async (id: string, transportData: any) => {
    try {
      const response = await api.updateTransport(id, transportData);
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

  const deleteTransport = async (id: string) => {
    try {
      await api.deleteTransport(id);
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

  const assignCourier = async (transportId: string, courierId: string) => {
    try {
      await api.assignTransportToCourier(transportId, courierId);
      await fetchTransports();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się przypisać kuriera do pojazdu";
      console.error("Error assigning courier:", err);
      return { success: false, error: errorMessage };
    }
  };

  const unassignCourier = async (transportId: string) => {
    try {
      await api.unassignTransport(transportId);
      await fetchTransports();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się odznączyć kuriera";
      console.error("Error unassigning courier:", err);
      return { success: false, error: errorMessage };
    }
  };

  return {
    transports,
    loading,
    error,
    fetchTransports,
    createTransport,
    updateTransport,
    deleteTransport,
    assignCourier,
    unassignCourier,
  };
};

