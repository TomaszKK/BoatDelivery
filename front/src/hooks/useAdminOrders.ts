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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchOrders = useCallback(
    async (page = 0, status = "ALL", search = "") => {
      setIsLoading(true);
      try {
        const statusParam = status === "ALL" ? undefined : status;
        const searchParam = search === "" ? undefined : search;
        
        const response = await trackPromise(
          api.getOrdersPaged(page, 10, statusParam, searchParam),
        );

        const data = response.data;
        setOrders(data.content || []);
        setCurrentPage(data.currentPage || data.pageNumber || 0);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (e) {
        toast.error(t("admin.fetchOrdersFail", "Nie udało się pobrać listy zamówień."));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) fetchOrders(currentPage + 1, statusFilter, searchQuery);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) fetchOrders(currentPage - 1, statusFilter, searchQuery);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    fetchOrders(0, newStatus, searchQuery);
  };

  const archiveOrder = async (trackingNumber: string) => {
    try {
      await trackPromise(api.archiveOrder(trackingNumber));
      toast.success(t("admin.archiveOrderSuccess"));
      fetchOrders(currentPage, statusFilter, searchQuery);
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
    searchQuery,
    setSearchQuery,
    handleStatusChange,
    handleNextPage,
    handlePrevPage,
    fetchOrders,
    archiveOrder,
  };
};