import { useState, useMemo, useEffect, useRef } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/api/api";
import { RouteMapModal } from "@/components/RouteMapModal";
import type { RouteResponseDTO, CourierRouteStatusDTO, CourierRouteDetailsResponse } from "@/types/RoutingTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, MapPinned } from "lucide-react";

type SortField = "firstName" | "lastName" | "email" | "phoneNumber";
type SortOrder = "asc" | "desc" | null;
type TabType = "customers" | "couriers";

const UserTable = ({
  users,
  onDelete,
  isDeleting,
  t,
  page,
  size,
  totalCount,
  totalPages,
  onPageChange,
  onSizeChange,
  loading,
  activeTab,
  onViewRoute,
  routesLoading,
  hasRouteMap,
}: {
  users: any[];
  onDelete: (user: any) => void;
  isDeleting: string | null;
  t: any;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  loading: boolean;
  activeTab: TabType;
  onViewRoute: (user: any) => void;
  routesLoading: boolean;
  hasRouteMap: Record<string, boolean>;
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Sortuj użytkowników (bez filtrowania, bo filtrowanie już robi backend)
  const displayedUsers = useMemo(() => {
    const displayList = [...users];

    if (sortField && sortOrder) {
      displayList.sort((a, b) => {
        const aValue = (a[sortField] || "").toString().toLowerCase();
        const bValue = (b[sortField] || "").toString().toLowerCase();

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return displayList;
  }, [users, sortField, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin">
                <ChevronRight className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">{t("common.loading")}</p>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.users.id") || "ID"}</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("firstName")}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  {t("admin.users.firstName") || "Imię"}
                  {sortField !== "firstName" ? (
                    <ArrowUpDown className="h-4 w-4" />
                  ) : sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("lastName")}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  {t("admin.users.lastName") || "Nazwisko"}
                  {sortField !== "lastName" ? (
                    <ArrowUpDown className="h-4 w-4" />
                  ) : sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  {t("admin.users.email") || "Email"}
                  {sortField !== "email" ? (
                    <ArrowUpDown className="h-4 w-4" />
                  ) : sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("phoneNumber")}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  {t("admin.users.phoneNumber") || "Telefon"}
                  {sortField !== "phoneNumber" ? (
                    <ArrowUpDown className="h-4 w-4" />
                  ) : sortOrder === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </button>
              </TableHead>
              <TableHead>{t("admin.users.createdAt") || "Data Utworzenia"}</TableHead>
              {activeTab === "couriers" && (
                <TableHead>{t("admin.routes.hasRoute", "Ma trasę")}</TableHead>
              )}
              <TableHead className="text-right">{t("common.actions") || "Akcje"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm">{user.id}</TableCell>
                  <TableCell>{user.firstName || "-"}</TableCell>
                  <TableCell>{user.lastName || "-"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber || "-"}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("pl-PL")
                      : "-"}
                  </TableCell>
                  {activeTab === "couriers" && (
                    <TableCell>
                      {hasRouteMap[user.id] ? t("common.yes", "Tak") : t("common.no", "Nie")}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {activeTab === "couriers" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewRoute(user)}
                          disabled={routesLoading}
                        >
                          <MapPinned className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(user)}
                        disabled={isDeleting === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={activeTab === "couriers" ? 8 : 7} className="text-muted-foreground text-center">
                  {t("admin.users.noUsers") || "Brak użytkowników"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">
            {t("admin.fleet.itemsPerPage") || "Pozycji na stronę"}:
          </label>
          <select
            value={size}
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          {t("admin.users.totalUsers") || "Razem użytkowników"}: {totalCount}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(p)}
                disabled={loading}
                className="min-w-10"
              >
                {p + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1 || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AdminPage = () => {
  const { t } = useTranslation();
  const {
    users,
    loading,
    error,
    deleteUser,
    page,
    size,
    totalCount,
    totalPages,
    countByType,
    fetchUsersByTypePaged,
    searchUsersByType,
  } = useUsers();
  const [activeTab, setActiveTab] = useState<TabType>("customers");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [routesByCourierId, setRoutesByCourierId] = useState<Record<string, RouteResponseDTO>>({});
  const [routesLoading, setRoutesLoading] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<any | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteResponseDTO | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [hasRouteMap, setHasRouteMap] = useState<Record<string, boolean>>({});

  const fetchRoutesStatus = async () => {
    try {
      const response = await api.getCouriersRouteStatus();
      const data = (response.data || []) as CourierRouteStatusDTO[];
      const map: Record<string, boolean> = {};
      data.forEach((entry) => {
        map[entry.courierId] = entry.hasRoute;
      });
      setHasRouteMap(map);
    } catch (err) {
      console.error("Failed to fetch route status:", err);
      setHasRouteMap({});
    }
  };

  const fetchRouteDetails = async (courierId: string) => {
    setRoutesLoading(true);
    try {
      const response = await api.getCourierRouteDetails(courierId);
      const data = response.data as CourierRouteDetailsResponse;
      setSelectedRoute(data.route || null);
      setSelectedCourier((prev: any) => ({
        ...prev,
        transport: data.transport || null,
      }));
    } catch (err) {
      console.error("Failed to fetch route details:", err);
      setSelectedRoute(null);
    } finally {
      setRoutesLoading(false);
    }
  };

  const handleViewRoute = (courier: any) => {
    setSelectedCourier(courier);
    setSelectedRoute(null);
    setRouteDialogOpen(true);
    fetchRouteDetails(courier.id);
  };

  const totalRouteWeight = useMemo(() => {
    if (!selectedRoute?.stops) return 0;
    return selectedRoute.stops.reduce((sum, stop) => sum + (stop.order?.weight || 0), 0);
  }, [selectedRoute]);

  const transportCapacity = selectedCourier?.transport?.cargoCapacity ?? null;
  const isOverloaded = transportCapacity != null && totalRouteWeight > transportCapacity;

  // Pobierz użytkowników po typie gdy zmienia się aktywna zakladka
  useEffect(() => {
    const userType = activeTab === "customers" ? "CUSTOMER" : "COURIER";
    setSearchTerm("");
    fetchUsersByTypePaged(userType, 0, size);
    if (userType === "COURIER") {
      fetchRoutesStatus();
    }
  }, [activeTab]);

  // Wyszukuj użytkowników gdy zmienia się searchTerm - z debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const userType = activeTab === "customers" ? "CUSTOMER" : "COURIER";

    debounceTimer.current = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsersByType(userType, searchTerm, 0, size);
      } else {
        fetchUsersByTypePaged(userType, 0, size);
      }
    }, 300); // Czeka 300ms zanim wyśle żądanie

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Niestandardowe handlery paginacji dla wyszukiwania
  const handlePageChangeWithSearch = (newPage: number) => {
    const userType = activeTab === "customers" ? "CUSTOMER" : "COURIER";
    if (searchTerm.trim()) {
      searchUsersByType(userType, searchTerm, newPage, size);
    } else {
      fetchUsersByTypePaged(userType, newPage, size);
    }
  };

  const handleSizeChangeWithSearch = (newSize: number) => {
    const userType = activeTab === "customers" ? "CUSTOMER" : "COURIER";
    if (searchTerm.trim()) {
      searchUsersByType(userType, searchTerm, 0, newSize);
    } else {
      fetchUsersByTypePaged(userType, 0, newSize);
    }
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete({ id: user.id, email: user.email });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(userToDelete.id);
    const result = await deleteUser(userToDelete.id);
    if (result.success) {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } else {
      console.error("Delete failed:", result.error);
    }
    setIsDeleting(null);
  };

  return (
    <div className={`container mx-auto max-w-6xl px-4 py-8 transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4">
          <p className="text-destructive font-semibold">{t("common.error")}</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          {t("admin.users.title") || "Zarządzanie Użytkownikami"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("admin.users.manageDesc") || "Zarządzaj użytkownikami systemu, dodawaj, edytuj i usuwaj konta"}
        </p>
      </div>

      {/* Stats Cards */}
      {countByType && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("admin.users.totalUsers") || "Razem Użytkowników"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByType.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("admin.users.customers") || "Klienci"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByType.customerCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("admin.users.couriers") || "Kurierzy"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByType.courierCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("admin.users.admins") || "Administratorzy"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countByType.adminCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder={t("admin.users.search") || "Szukaj po imieniu, nazwisku lub emailu..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b mb-8">
        <button
          onClick={() => setActiveTab("customers")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === "customers"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("admin.users.customers") || "Klienci"}
          <span className="text-sm bg-muted rounded-full px-2 py-1">{countByType?.customerCount || 0}</span>
        </button>
        <button
          onClick={() => setActiveTab("couriers")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === "couriers"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("admin.users.couriers") || "Kurierzy"}
          <span className="text-sm bg-muted rounded-full px-2 py-1">{countByType?.courierCount || 0}</span>
        </button>
      </div>

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.users.customers") || "Klienci"}</CardTitle>
            <CardDescription>
              {t("admin.users.customersDesc") || "Lista wszystkich zarejestrowanych klientów"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              key="customers"
              users={users}
              onDelete={handleDeleteClick}
              isDeleting={isDeleting}
              t={t}
              page={page}
              size={size}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={handlePageChangeWithSearch}
              onSizeChange={handleSizeChangeWithSearch}
              loading={loading}
              activeTab={activeTab}
              onViewRoute={handleViewRoute}
              routesLoading={routesLoading}
              hasRouteMap={hasRouteMap}
            />
          </CardContent>
        </Card>
      )}

      {/* Couriers Tab */}
      {activeTab === "couriers" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.users.couriers") || "Kurierzy"}</CardTitle>
            <CardDescription>
              {t("admin.users.couriersDesc") || "Lista wszystkich zarejestrowanych kurierów"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              key="couriers"
              users={users}
              onDelete={handleDeleteClick}
              isDeleting={isDeleting}
              t={t}
              page={page}
              size={size}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={handlePageChangeWithSearch}
              onSizeChange={handleSizeChangeWithSearch}
              loading={loading}
              activeTab={activeTab}
              onViewRoute={handleViewRoute}
              routesLoading={routesLoading}
              hasRouteMap={hasRouteMap}
            />
          </CardContent>
        </Card>
      )}

      <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("admin.routes.title", "Trasa kuriera")}</DialogTitle>
            <DialogDescription>
              {selectedCourier
                ? `${selectedCourier.firstName || ""} ${selectedCourier.lastName || ""} · ${selectedCourier.email}`
                : t("admin.routes.noCourier", "Nie wybrano kuriera")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold">{t("admin.routes.transport", "Pojazd")}</p>
                {selectedCourier?.transport ? (
                  <div className="mt-2 space-y-1 text-sm">
                    <p>{selectedCourier.transport.brand} {selectedCourier.transport.model}</p>
                    <p>{selectedCourier.transport.transportType}</p>
                    <p>{t("admin.routes.license", "Rejestracja")}: {selectedCourier.transport.licensePlate || "-"}</p>
                    <p>{t("admin.routes.capacity", "Ładowność")}: {selectedCourier.transport.cargoCapacity ?? "-"}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-amber-600">{t("admin.routes.noTransport", "Brak przypisanego pojazdu")}</p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold">{t("admin.routes.summary", "Podsumowanie trasy")}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>{t("admin.routes.status", "Status")}: {selectedRoute?.status || t("admin.routes.noRoute", "Brak")}</p>
                  <p>{t("admin.routes.stops", "Liczba paczek")}: {selectedRoute?.stops?.length || 0}</p>
                  {selectedRoute?.estimatedDurationMin !== undefined && (
                      <p>
                        {t("admin.routes.duration", "Przewidywany czas")}:{" "}
                        <span className="font-medium">
                          {selectedRoute.estimatedDurationMin >= 60
                            ? `${Math.floor(selectedRoute.estimatedDurationMin / 60)}h ${selectedRoute.estimatedDurationMin % 60}min`
                            : `${selectedRoute.estimatedDurationMin} min`}
                        </span>
                      </p>
                  )}
                  <p className={isOverloaded ? "text-red-600 font-semibold" : ""}>
                    {t("admin.routes.totalWeight", "Suma wag")}: {totalRouteWeight.toFixed(2)}
                  </p>
                  {transportCapacity != null && (
                    <p className={isOverloaded ? "text-red-600 font-semibold" : ""}>
                      {t("admin.routes.capacity", "Ładowność")}: {transportCapacity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold">{t("admin.routes.packages", "Paczki na trasie")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapOpen(true)}
                  disabled={!selectedRoute}
                >
                  {t("admin.routes.showMap", "Pokaż mapę")}
                </Button>
              </div>
              {selectedRoute?.stops?.length ? (
                <div className="mt-3 max-h-64 overflow-auto text-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("admin.routes.tracking", "Tracking")}</TableHead>
                        <TableHead>{t("admin.routes.status", "Status")}</TableHead>
                        <TableHead>{t("admin.routes.weight", "Waga")}</TableHead>
                        <TableHead>{t("admin.routes.address", "Adres")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRoute.stops
                        .sort((a, b) => a.stopSequence - b.stopSequence)
                        .map((stop) => (
                          <TableRow key={stop.id}>
                            <TableCell>{stop.order.trackingNumber}</TableCell>
                            <TableCell>{stop.order.status}</TableCell>
                            <TableCell>{stop.order.weight}</TableCell>
                            <TableCell>{stop.order.pickupLocation.streetAddress}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("admin.routes.noRoute", "Brak aktywnej trasy dla tego kuriera.")}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RouteMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} route={selectedRoute} />

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("common.confirmDelete") || "Potwierdzenie usunięcia"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.users.deleteWarning") || "Czy na pewno chcesz usunąć tego użytkownika"}{" "}
              <strong>{userToDelete?.email}</strong>
              {t("admin.users.deleteWarningDetails") || "? Ta operacja nie może być cofnięta."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
            {isDeleting ? t("common.deleting") || "Usuwanie..." : t("common.delete") || "Usuń"}
          </AlertDialogAction>
          <AlertDialogCancel>{t("common.cancel") || "Anuluj"}</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
