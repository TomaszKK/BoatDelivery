import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAdminOrders } from "@/hooks/useAdminOrders";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, PackageSearch, Archive } from "lucide-react";
import { api } from "@/api/api";
import { toast } from "sonner";
import { trackPromise } from "react-promise-tracker";

// Zaktualizowana pełna lista statusów z Twojego OrderType.ts
const ORDER_STATUSES = [
  "ALL",
  "ORDER_CREATED",
  "CALCULATING_ROUTE_RECEIVE",
  "ROUTE_ASSIGNED_RECEIVE",
  "IN_TRANSIT_FOR_PACKAGE",
  "ORDER_RECEIVED_FROM_CUSTOMER",
  "IN_SORTING_CENTER",
  "CALCULATING_ROUTE_DELIVERY",
  "ROUTE_ASSIGNED_DELIVERY",
  "IN_TRANSIT_TO_CUSTOMER",
  "DELIVERY_COMPLETED",
  "ORDER_CANCELED"
];

export const AdminOrdersPage = () => {
  const { t } = useTranslation();
  const { 
    orders, 
    currentPage, 
    totalPages, 
    totalElements, 
    isLoading, 
    statusFilter, 
    handleStatusChange, 
    handleNextPage, 
    handlePrevPage, 
    fetchOrders 
  } = useAdminOrders();

  useEffect(() => {
    fetchOrders(0, "ALL");
  }, [fetchOrders]);

  const archiveOrder = async (trackingNumber: string) => {
    try {
      await trackPromise(api.archiveOrder(trackingNumber));
      toast.success(t("admin.archiveOrderSuccess"));
      fetchOrders(currentPage, statusFilter); 
    } catch (e) {
      toast.error(t("admin.archiveOrderFail"));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("admin.allOrders")}</h2>
          <p className="text-muted-foreground mt-1">
            {t("admin.allOrdersDesc")} ({totalElements})
          </p>
        </div>

        {/* FILTROWANIE PO STATUSIE */}
        <div className="w-full md:w-64">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("admin.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ALL" ? t("admin.allStatuses") : t(`orders.${status}`, status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[180px]">{t("admin.tableTracking")}</TableHead>
                  <TableHead>{t("admin.tableDate")}</TableHead>
                  <TableHead>{t("admin.tableWeight")}</TableHead>
                  <TableHead>{t("admin.tableDestination")}</TableHead>
                  <TableHead>{t("admin.tableStatus")}</TableHead>
                  <TableHead className="text-right">{t("admin.tableActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      {t("admin.loadingData")}
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <PackageSearch className="h-8 w-8 mb-2 opacity-20" />
                        <p>{t("admin.noOrdersFound")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const date = new Date(order.createdAt).toLocaleDateString();
                    return (
                      <TableRow key={order.trackingNumber} className="hover:bg-muted/30">
                        <TableCell className="font-mono font-medium">{order.trackingNumber}</TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{order.weight} kg</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={order.deliveryLocation?.city}>
                          {order.deliveryLocation?.city}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-background">
                            {t(`orders.${order.status}`, order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => archiveOrder(order.trackingNumber)}
                            title={t("admin.archiveOrderAction")}
                          >
                            <Archive className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        {/* PAGINACJA */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
            <p className="text-sm text-muted-foreground">
              {t("admin.showingPage")} <span className="font-medium text-foreground">{currentPage + 1}</span> {t("admin.of")} <span className="font-medium text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 0 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("admin.prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1 || isLoading}
              >
                {t("admin.next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};