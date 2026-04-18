import { useState, useEffect } from "react";
import { api } from "@/api/api";
import type { PaginatedResponse } from "@/api/api";
import type { Transport } from "@/types/TransportType";

export const useTransports = () => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  const fetchTransportsPaged = async (newPage: number = 0, newSize: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllTransportsPaged(newPage, newSize);
      const data = response.data as PaginatedResponse<Transport>;
      setTransports(data.content || []);
      setPage(data.page);
      setSize(data.size);
      setTotalCount(data.totalElements);
      setTotalPages(data.totalPages);
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

  const searchTransports = async (query: string = "", newPage: number = 0, newSize: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchTransports(query, newPage, newSize);
      const data = response.data as PaginatedResponse<Transport>;
      setTransports(data.content || []);
      setPage(data.page);
      setSize(data.size);
      setTotalCount(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się wyszukać pojazdów";
      setError(errorMessage);
      console.error("Error searching transports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportsPaged(0, size);
  }, [size]);

  const createTransport = async (transportData: any): Promise<any> => {
    try {
      const response = await api.createTransport(transportData);
      await fetchTransportsPaged(page, size);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      // Sprawdzaj czy błąd ma fieldErrors z serwera
      if (err instanceof Error) {
        const errorData = (err as any).response?.data;
        if (errorData?.fieldErrors) {
          return { 
            success: false, 
            error: errorData.message || "Błąd walidacji",
            fieldErrors: errorData.fieldErrors 
          };
        }
      }
      
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się utworzyć pojazdu";
      console.error("Error creating transport:", err);
      return { success: false, error: errorMessage };
    }
  };

  const updateTransport = async (id: string, transportData: any): Promise<any> => {
    try {
      const response = await api.updateTransport(id, transportData);
      await fetchTransportsPaged(page, size);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      // Sprawdzaj czy błąd ma fieldErrors z serwera
      if (err instanceof Error) {
        const errorData = (err as any).response?.data;
        if (errorData?.fieldErrors) {
          return { 
            success: false, 
            error: errorData.message || "Błąd walidacji",
            fieldErrors: errorData.fieldErrors 
          };
        }
      }
      
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
      await fetchTransportsPaged(page, size);
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
      await fetchTransportsPaged(page, size);
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
      await fetchTransportsPaged(page, size);
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

  const handlePageChange = (newPage: number) => {
    fetchTransportsPaged(newPage, size);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
  };

  return {
    transports,
    loading,
    error,
    page,
    size,
    totalCount,
    totalPages,
    fetchTransports,
    fetchTransportsPaged,
    searchTransports,
    createTransport,
    updateTransport,
    deleteTransport,
    assignCourier,
    unassignCourier,
    handlePageChange,
    handleSizeChange,
  };
};

