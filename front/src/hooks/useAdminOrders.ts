import { useState, useCallback } from "react";
import { api } from "@/api/api";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { trackPromise } from "react-promise-tracker";
import type { OrderResponseDTO } from "@/types/OrderType";

export const useAdminOrders = () => {
  const { t } = useTranslation();
  
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchOrders = useCallback(async (page = 0, status = "ALL") => {
    setIsLoading(true);
    try {
      const statusParam = status === "ALL" ? undefined : status;
      const response = await trackPromise(api.getOrdersPaged(page, 10, statusParam));
      
      const data = response.data;
      setOrders(data.content || []);
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (e) {
      toast.error(t("admin.fetchOrdersFail", "Nie udało się pobrać listy zamówień."));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchOrders(nextPage, statusFilter);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchOrders(prevPage, statusFilter);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(0);
    fetchOrders(0, newStatus);
  };

  const archiveOrder = async (trackingNumber: string) => {
    try {
      await trackPromise(api.archiveOrder(trackingNumber));
        toast.success(t("admin.archiveOrderSuccess"));
    } catch (e) {
      toast.error(t("admin.archiveOrderFail"));
    }
  };

  return {
    orders,
    currentPage,
    totalPages,
    totalElements,
    isLoading,
    statusFilter,
    handleStatusChange,
    handleNextPage,
    handlePrevPage,
    fetchOrders,
    archiveOrder
  };
};