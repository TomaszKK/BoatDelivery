import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminOrders } from "@/hooks/useAdminOrders";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, PackageSearch, Archive, User, Mail, Phone, Search, Truck } from "lucide-react";
import { api } from "@/api/api";
import { toast } from "sonner";
import { trackPromise } from "react-promise-tracker";

const ORDER_STATUSES = [
  "ALL", "WAITING_FOR_PAYMENT", "ORDER_CREATED", "CALCULATING_ROUTE_RECEIVE", "ROUTE_ASSIGNED_RECEIVE",
  "IN_TRANSIT_FOR_PACKAGE", "ORDER_RECEIVED_FROM_CUSTOMER", "IN_SORTING_CENTER", "CALCULATING_ROUTE_DELIVERY",
  "ROUTE_ASSIGNED_DELIVERY", "IN_TRANSIT_TO_CUSTOMER", "DELIVERY_COMPLETED", "ORDER_CANCELED",
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
    searchQuery,
    setSearchQuery,
    handleStatusChange,
    handleNextPage,
    handlePrevPage,
    fetchOrders,
  } = useAdminOrders();

  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== localSearch) {
        setSearchQuery(localSearch);
        fetchOrders(0, statusFilter, localSearch);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [localSearch, searchQuery, statusFilter, fetchOrders, setSearchQuery]);

  useEffect(() => {
    fetchOrders(0, "ALL", "");
  }, [fetchOrders]);

  const archiveOrder = async (trackingNumber: string) => {
    try {
      await trackPromise(api.archiveOrder(trackingNumber));
      toast.success(t("admin.archiveOrderSuccess", "Zamówienie zarchiwizowane."));
      fetchOrders(currentPage, statusFilter, searchQuery);
    } catch (e) {
      toast.error(t("admin.archiveOrderFail", "Błąd podczas archiwizacji."));
    }
  };

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-[1400px] space-y-6 p-6">
        
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("admin.allOrders", "Wszystkie Zamówienia")}</h2>
            <p className="text-muted-foreground mt-1">
              {t("admin.allOrdersDesc", "Zarządzaj i filtruj wszystkie paczki w systemie.")} ({totalElements})
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("admin.searchPlaceholder", "Szukaj numeru paczki...")}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="w-full md:w-56">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t("admin.filterByStatus", "Filtruj po statusie")} />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "ALL" ? t("admin.allStatuses", "Wszystkie statusy") : t(`status.${status}`, status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="rounded-md border-0 min-w-[1000px]">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[160px]">{t("admin.tableTracking", "Nr Nadania")}</TableHead>
                    <TableHead>{t("admin.tableDate", "Data")}</TableHead>
                    <TableHead>{t("admin.tableWeight", "Waga")}</TableHead>
                    <TableHead>{t("admin.tableDestination", "Cel")}</TableHead>
                    <TableHead>{t("admin.tableCourier", "Kurier")}</TableHead> 
                    <TableHead>{t("admin.tableStatus", "Status")}</TableHead>
                    <TableHead className="text-right">{t("admin.tableActions", "Akcje")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-muted-foreground h-32 text-center">
                        {t("admin.loadingData", "Ładowanie danych...")}
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="text-muted-foreground flex flex-col items-center justify-center">
                          <PackageSearch className="mb-2 h-8 w-8 opacity-20" />
                          <p>{t("admin.noOrdersFound", "Brak wyników wyszukiwania.")}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => {
                      const date = new Date(order.createdAt).toLocaleDateString();
                      
                      const assignedCourier = order.courierInfo;

                      return (
                        <TableRow key={order.trackingNumber} className="hover:bg-muted/30">
                          <TableCell className="font-mono font-medium">{order.trackingNumber}</TableCell>
                          <TableCell>{date}</TableCell>
                          <TableCell>{order.weight} kg</TableCell>
                          
                          {/* ODBIORCA */}
                          <TableCell className="max-w-[200px] truncate">
                            <div className="flex items-center gap-2">
                              <span title={order.deliveryLocation?.city}>{order.deliveryLocation?.city}</span>
                              {order.recipientFirstName && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="bg-emerald-500/10 text-emerald-600 rounded-full p-1 cursor-help hover:bg-emerald-500/20 transition-colors">
                                      <User className="h-3.5 w-3.5" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="p-3 w-max" side="right">
                                    <p className="font-bold border-b pb-1 mb-2 border-border/50 text-sm">
                                      {t("orders.recipientData", "Dane Odbiorcy")}
                                    </p>
                                    <div className="flex flex-col gap-2"> 
                                      <div className="flex items-center gap-2 text-sm">
                                        <User className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                        <span className="font-medium">{order.recipientFirstName} {order.recipientLastName}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                        <span className="font-mono">{order.recipientPhone}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                        <span className="truncate">{order.recipientEmail}</span>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>

                          {/* KURIER */}
                          <TableCell>
                            {assignedCourier ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-help w-max hover:opacity-80 transition-opacity">
                                        <div className="bg-orange-500/10 text-orange-600 rounded-full p-1.5">
                                          <Truck className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">{assignedCourier.firstName}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="p-3 w-max" side="right">
                                    <p className="font-bold border-b pb-1 mb-2 border-border/50 text-sm">
                                      {t("admin.courierDetails", "Dane Kuriera")}
                                    </p>
                                    <div className="flex flex-col gap-2"> 
                                      <div className="flex items-center gap-2 text-sm">
                                        <User className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                        <span className="font-medium">{assignedCourier.firstName} {assignedCourier.lastName}</span>
                                      </div>
                                      {assignedCourier.phoneNumber && (
                                          <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                            <span className="font-mono">{assignedCourier.phoneNumber}</span>
                                          </div>
                                      )}
                                      <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                        <span className="truncate">{assignedCourier.email}</span>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                            ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>

                          {/* STATUS */}
                          <TableCell>
                            <Badge variant="outline" className="bg-background">
                              {t(`status.${order.status}`, order.status)}
                            </Badge>
                          </TableCell>

                          {/* AKCJE */}
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => archiveOrder(order.trackingNumber)}
                              title={t("admin.archiveOrderAction", "Archiwizuj")}
                            >
                              <Archive className="text-muted-foreground hover:text-primary h-4 w-4 transition-colors" />
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

          {totalPages > 0 && (
            <div className="bg-muted/20 flex items-center justify-between border-t px-6 py-4">
              <p className="text-muted-foreground text-sm">
                {t("admin.showingPage", "Strona")} <span className="text-foreground font-medium">{currentPage + 1}</span> {t("admin.of", "z")} <span className="text-foreground font-medium">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 0 || isLoading}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> {t("admin.prev", "Poprzednia")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= totalPages - 1 || isLoading}>
                  {t("admin.next", "Następna")} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </TooltipProvider>
  );
};