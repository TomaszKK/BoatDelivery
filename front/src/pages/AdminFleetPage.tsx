import { useState, useMemo } from "react";
import { useTransports } from "@/hooks/useTransports";
import { useUsers } from "@/hooks/useUsers";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, User, Plus, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";

type TransportFormData = {
  transportType: string;
  brand: string;
  model: string;
  fuelType: string;
  trunkVolume: number;
  cargoCapacity: number;
  consumption: number;
  licensePlate: string;
  color: string;
};

const initialFormData: TransportFormData = {
  transportType: "CAR",
  brand: "",
  model: "",
  fuelType: "PETROL",
  trunkVolume: 0,
  cargoCapacity: 0,
  consumption: 0,
  licensePlate: "",
  color: "",
};

export const AdminFleetPage = () => {
  const { t } = useTranslation();
  const {
    transports,
    loading,
    error,
    page,
    size,
    totalCount,
    totalPages,
    createTransport,
    updateTransport,
    deleteTransport,
    assignCourier,
    unassignCourier,
    handlePageChange,
    handleSizeChange,
  } = useTransports();
  const { users, fetchUsersPaged } = useUsers();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [courierDialogOpen, setCourierDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TransportFormData>(initialFormData);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [transportToDelete, setTransportToDelete] = useState<any>(null);
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<"brand" | "model" | "licensePlate" | "type">("brand");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Funkcja do sortowania kolumny
  const handleSort = (column: "brand" | "model" | "licensePlate" | "type") => {
    if (sortColumn === column) {
      // Jeśli kliknięto tę samą kolumnę, zmień kierunek
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Jeśli kliknięto nową kolumnę, sortuj rosnąco
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Pobierz użytkowników (kurierów) na start
  useEffect(() => {
    fetchUsersPaged(0, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const couriers = useMemo(() => users.filter((u) => u.userType === "COURIER"), [users]);

  const availableCouriers = useMemo(() => {
    return couriers.filter((courier) => {
      // Filtruj kurierów którzy nie mają przypisanego pojazdu
      return !transports.some((t) => t.courier?.id === courier.id);
    });
  }, [couriers, transports]);

  const filteredTransports = useMemo(() => {
    const filtered = transports.filter((transport) =>
      `${transport.brand} ${transport.model} ${transport.licensePlate}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    // Sortuj transporty
    filtered.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortColumn) {
        case "brand":
          valueA = a.brand?.toLowerCase() || "";
          valueB = b.brand?.toLowerCase() || "";
          break;
        case "model":
          valueA = a.model?.toLowerCase() || "";
          valueB = b.model?.toLowerCase() || "";
          break;
        case "licensePlate":
          valueA = a.licensePlate?.toLowerCase() || "";
          valueB = b.licensePlate?.toLowerCase() || "";
          break;
        case "type":
          valueA = a.transportType || "";
          valueB = b.transportType || "";
          break;
        default:
          valueA = a.model?.toLowerCase() || "";
          valueB = b.model?.toLowerCase() || "";
      }

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [transports, searchTerm, sortColumn, sortDirection]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-destructive/10 p-4">
          <p className="text-destructive font-semibold">{t("common.error")}</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const handleAddTransport = async () => {
    const errors: Record<string, string> = {};

    // Walidacja wymaganych pól
    if (!formData.brand) {
      errors.brand = t("admin.fleet.brandRequired") || "Marka jest wymagana";
    }
    if (!formData.model) {
      errors.model = t("admin.fleet.modelRequired") || "Model jest wymagany";
    }
    if (!formData.licensePlate) {
      errors.licensePlate = t("admin.fleet.licensePlateRequired") || "Tablica rejestracyjna jest wymagana";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    const result = await createTransport(formData);
    setIsSubmitting(false);

    if (result.success) {
      setAddDialogOpen(false);
      setFormData(initialFormData);
      setFieldErrors({});
    } else {
      // Sprawdzaj czy są fieldErrors
      if (result && 'fieldErrors' in result && result.fieldErrors && Array.isArray(result.fieldErrors) && result.fieldErrors.length > 0) {
        const serverErrors: Record<string, string> = {};
        result.fieldErrors.forEach((err: any) => {
          serverErrors[err.field] = err.message;
        });
        setFieldErrors(serverErrors);
      } else {
        setFieldErrors({});
      }
    }
  };

  const handleEditTransport = async () => {
    if (!selectedTransport) return;

    const errors: Record<string, string> = {};

    // Walidacja wymaganych pól
    if (!formData.brand) {
      errors.brand = t("admin.fleet.brandRequired") || "Marka jest wymagana";
    }
    if (!formData.model) {
      errors.model = t("admin.fleet.modelRequired") || "Model jest wymagany";
    }
    if (!formData.licensePlate) {
      errors.licensePlate = t("admin.fleet.licensePlateRequired") || "Tablica rejestracyjna jest wymagana";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    const result = await updateTransport(selectedTransport.id, formData);
    setIsSubmitting(false);

    if (result.success) {
      setEditDialogOpen(false);
      setSelectedTransport(null);
      setFormData(initialFormData);
      setFieldErrors({});
    } else {
      // Sprawdzaj czy są fieldErrors
      if (result && 'fieldErrors' in result && result.fieldErrors && Array.isArray(result.fieldErrors) && result.fieldErrors.length > 0) {
        const serverErrors: Record<string, string> = {};
        result.fieldErrors.forEach((err: any) => {
          serverErrors[err.field] = err.message;
        });
        setFieldErrors(serverErrors);
      } else {
        setFieldErrors({});
      }
    }
  };

  const handleDeleteClick = (transport: any) => {
    setTransportToDelete(transport);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transportToDelete) return;
    setIsSubmitting(true);
    const result = await deleteTransport(transportToDelete.id);
    setIsSubmitting(false);

    if (result.success) {
      setDeleteDialogOpen(false);
      setTransportToDelete(null);
    } else {
      alert(result.error);
    }
  };

  const handleAssignCourier = async () => {
    if (!selectedTransport || !selectedCourier) return;

    setIsSubmitting(true);
    const result = await assignCourier(selectedTransport.id, selectedCourier);
    setIsSubmitting(false);

    if (result.success) {
      setCourierDialogOpen(false);
      setSelectedTransport(null);
      setSelectedCourier(null);
    } else {
      alert(result.error);
    }
  };

  const handleUnassignCourier = async () => {
    if (!selectedTransport) return;

    setIsSubmitting(true);
    const result = await unassignCourier(selectedTransport.id);
    setIsSubmitting(false);

    if (result.success) {
      setSelectedTransport(null);
    } else {
      alert(result.error);
    }
  };

  const openEditDialog = (transport: any) => {
    setSelectedTransport(transport);
    setFormData({
      transportType: transport.transportType,
      brand: transport.brand,
      model: transport.model,
      fuelType: transport.fuelType,
      trunkVolume: transport.trunkVolume,
      cargoCapacity: transport.cargoCapacity,
      consumption: transport.consumption,
      licensePlate: transport.licensePlate,
      color: transport.color,
    });
    setFieldErrors({});
    setEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData(initialFormData);
    setFieldErrors({});
    setAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            {t("admin.fleet.title") || "Zarządzanie Flotą"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("admin.fleet.description") || "Zarządzaj pojazdami i przypisuj je do kurierów"}
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("admin.fleet.addVehicle") || "Dodaj pojazd"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("admin.fleet.addVehicle") || "Dodaj pojazd"}</DialogTitle>
              <DialogDescription>
                {t("admin.fleet.fillVehicleDetails") || "Wypełnij szczegóły nowego pojazdu"}
              </DialogDescription>
            </DialogHeader>
            <TransportForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddTransport}
              isSubmitting={isSubmitting}
              t={t}
              fieldErrors={fieldErrors}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder={t("admin.fleet.searchVehicles") || "Szukaj po marce, modelu lub tablicy..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Transports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("admin.fleet.vehiclesList") || "Lista Pojazdów"}</CardTitle>
              <CardDescription>
                {t("admin.fleet.vehiclesCount") || "Łącznie pojazdów"}: {totalCount} | {t("admin.fleet.page") || "Strona"} {page + 1} / {totalPages}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{t("admin.fleet.itemsPerPage") || "Pozycji na stronę"}:</label>
              <select
                value={size}
                onChange={(e) => handleSizeChange(parseInt(e.target.value))}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted" 
                    onClick={() => handleSort("brand")}
                  >
                    <div className="flex items-center gap-2">
                      {t("admin.fleet.brand") || "Marka"}
                      {sortColumn === "brand" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="h-4 w-4" /> : 
                          <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted" 
                    onClick={() => handleSort("model")}
                  >
                    <div className="flex items-center gap-2">
                      {t("admin.fleet.model") || "Model"}
                      {sortColumn === "model" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="h-4 w-4" /> : 
                          <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted" 
                    onClick={() => handleSort("licensePlate")}
                  >
                    <div className="flex items-center gap-2">
                      {t("admin.fleet.licensePlate") || "Tablica"}
                      {sortColumn === "licensePlate" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="h-4 w-4" /> : 
                          <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted" 
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center gap-2">
                      {t("admin.fleet.type") || "Typ"}
                      {sortColumn === "type" && (
                        sortDirection === "asc" ? 
                          <ArrowUp className="h-4 w-4" /> : 
                          <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>{t("admin.fleet.assignedCourier") || "Przypisany Kurier"}</TableHead>
                  <TableHead className="text-right">{t("common.actions") || "Akcje"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransports.length > 0 ? (
                  filteredTransports.map((transport) => (
                    <TableRow key={transport.id}>
                      <TableCell className="font-medium">{transport.brand}</TableCell>
                      <TableCell>{transport.model}</TableCell>
                      <TableCell className="font-mono text-sm">{transport.licensePlate}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {t(`transport.transportTypes.${transport.transportType}`) || transport.transportType}
                        </span>
                      </TableCell>
                      <TableCell>
                        {transport.courier ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <User className="h-4 w-4" />
                                {transport.courier.firstName} {transport.courier.lastName}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  {t("admin.fleet.courierDetails") || "Dane kuriera"}
                                </DialogTitle>
                              </DialogHeader>
                              <CourierDetailsModal courier={transport.courier} t={t} />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {t("admin.fleet.notAssigned") || "Nie przypisany"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog open={editDialogOpen && selectedTransport?.id === transport.id} onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(transport)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  {t("admin.fleet.editVehicle") || "Edytuj pojazd"}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedTransport && (
                                <TransportEditForm
                                  transport={selectedTransport}
                                  formData={formData}
                                  setFormData={setFormData}
                                  onSubmit={handleEditTransport}
                                  onAssignCourier={() => {
                                    setCourierDialogOpen(true);
                                    setEditDialogOpen(false);
                                  }}
                                  onUnassignCourier={handleUnassignCourier}
                                  isSubmitting={isSubmitting}
                                  t={t}
                                  fieldErrors={fieldErrors}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(transport)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground text-center py-8">
                      {t("admin.fleet.noVehicles") || "Brak pojazdów"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {t("admin.fleet.showing") || "Wyświetlanie"} {page * size + 1} - {Math.min((page + 1) * size, totalCount)} {t("admin.fleet.of") || "z"} {totalCount}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(p)}
                    className="min-w-10"
                  >
                    {p + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.confirmDelete") || "Potwierdzenie usunięcia"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.fleet.deleteWarning") || "Czy na pewno chcesz usunąć pojazd"}{" "}
              <strong>
                {transportToDelete?.brand} {transportToDelete?.model}
              </strong>
              {t("admin.fleet.deleteWarningDetails") || "? Ta operacja nie może być cofnięta."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
            {isSubmitting ? t("common.deleting") || "Usuwanie..." : t("common.delete") || "Usuń"}
          </AlertDialogAction>
          <AlertDialogCancel>{t("common.cancel") || "Anuluj"}</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Courier Dialog */}
      <Dialog open={courierDialogOpen} onOpenChange={setCourierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.fleet.assignCourier") || "Przypisz kuriera"}</DialogTitle>
            <DialogDescription>
              {t("admin.fleet.selectCourierFromList") || "Wybierz kuriera z listy dostępnych"}
            </DialogDescription>
          </DialogHeader>
          <AssignCourierForm
            availableCouriers={availableCouriers}
            selectedCourier={selectedCourier}
            setSelectedCourier={setSelectedCourier}
            onAssign={handleAssignCourier}
            isSubmitting={isSubmitting}
            t={t}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component: Transport Form
const TransportForm = ({ formData, setFormData, onSubmit, isSubmitting, t, fieldErrors = {} }: any) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.type") || "Typ pojazdu"}</label>
        <select
          value={formData.transportType}
          onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md ${fieldErrors.transportType ? 'border-red-500' : ''}`}
        >
          <option value="CAR">Samochód</option>
          <option value="VAN">Van</option>
          <option value="TRUCK">Ciężarówka</option>
        </select>
        {fieldErrors.transportType && <p className="text-red-500 text-sm mt-1">{fieldErrors.transportType}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">{t("admin.fleet.fuelType") || "Typ paliwa"}</label>
        <select
          value={formData.fuelType}
          onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md ${fieldErrors.fuelType ? 'border-red-500' : ''}`}
        >
          <option value="PETROL">Benzyna</option>
          <option value="DIESEL">Diesel</option>
          <option value="ELECTRIC">Elektryczne</option>
          <option value="HYBRID">Hybrydowe</option>
          <option value="LPG">LPG</option>
        </select>
        {fieldErrors.fuelType && <p className="text-red-500 text-sm mt-1">{fieldErrors.fuelType}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.brand") || "Marka"} *</label>
        <Input
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="np. Toyota"
          className={fieldErrors.brand ? 'border-red-500' : ''}
        />
        {fieldErrors.brand && <p className="text-red-500 text-sm mt-1">{fieldErrors.brand}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.model") || "Model"} *</label>
        <Input
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          placeholder="np. Corolla"
          className={fieldErrors.model ? 'border-red-500' : ''}
        />
        {fieldErrors.model && <p className="text-red-500 text-sm mt-1">{fieldErrors.model}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.licensePlate") || "Tablica rejestracyjna"} *</label>
        <Input
          value={formData.licensePlate}
          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
          placeholder="np. WA01ABC"
          className={fieldErrors.licensePlate ? 'border-red-500' : ''}
        />
        {fieldErrors.licensePlate && <p className="text-red-500 text-sm mt-1">{fieldErrors.licensePlate}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.color") || "Kolor"}</label>
        <Input
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          placeholder="np. Czarny"
          className={fieldErrors.color ? 'border-red-500' : ''}
        />
        {fieldErrors.color && <p className="text-red-500 text-sm mt-1">{fieldErrors.color}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.trunkVolume") || "Pojemność bagażnika"}</label>
        <Input
          type="number"
          value={formData.trunkVolume}
          onChange={(e) => setFormData({ ...formData, trunkVolume: parseFloat(e.target.value) })}
          placeholder="0"
          className={fieldErrors.trunkVolume ? 'border-red-500' : ''}
        />
        {fieldErrors.trunkVolume && <p className="text-red-500 text-sm mt-1">{fieldErrors.trunkVolume}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.cargoCapacity") || "Ładowność"}</label>
        <Input
          type="number"
          value={formData.cargoCapacity}
          onChange={(e) => setFormData({ ...formData, cargoCapacity: parseFloat(e.target.value) })}
          placeholder="0"
          className={fieldErrors.cargoCapacity ? 'border-red-500' : ''}
        />
        {fieldErrors.cargoCapacity && <p className="text-red-500 text-sm mt-1">{fieldErrors.cargoCapacity}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">{t("admin.fleet.consumption") || "Spalanie"}</label>
        <Input
          type="number"
          value={formData.consumption}
          onChange={(e) => setFormData({ ...formData, consumption: parseFloat(e.target.value) })}
          placeholder="0"
          className={fieldErrors.consumption ? 'border-red-500' : ''}
        />
        {fieldErrors.consumption && <p className="text-red-500 text-sm mt-1">{fieldErrors.consumption}</p>}
      </div>
    </div>

    <Button onClick={onSubmit} disabled={isSubmitting} className="w-full">
      {isSubmitting ? t("common.saving") || "Zapisywanie..." : t("common.save") || "Zapisz"}
    </Button>
  </div>
);

// Component: Transport Edit Form with Courier Management
const TransportEditForm = ({
  transport,
  formData,
  setFormData,
  onSubmit,
  onAssignCourier,
  onUnassignCourier,
  isSubmitting,
  t,
  fieldErrors = {},
}: any) => (
  <div className="space-y-6">
    <TransportForm
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      t={t}
      fieldErrors={fieldErrors}
    />

    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">{t("admin.fleet.courierAssignment") || "Przypisanie kuriera"}</h3>
      {transport.courier ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {transport.courier.firstName} {transport.courier.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{transport.courier.email}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onUnassignCourier}
            disabled={isSubmitting}
          >
            {t("admin.fleet.unassign") || "Odznacz"}
          </Button>
        </div>
      ) : (
        <Button onClick={onAssignCourier} variant="outline" className="w-full">
          {t("admin.fleet.assignCourier") || "Przypisz kuriera"}
        </Button>
      )}
    </div>
  </div>
);

// Component: Courier Details Modal
const CourierDetailsModal = ({ courier, t }: any) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">{t("admin.users.firstName") || "Imię"}</p>
        <p className="font-medium">{courier.firstName}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{t("admin.users.lastName") || "Nazwisko"}</p>
        <p className="font-medium">{courier.lastName}</p>
      </div>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">{t("admin.users.email") || "Email"}</p>
      <p className="font-medium">{courier.email}</p>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">{t("admin.users.phoneNumber") || "Telefon"}</p>
      <p className="font-medium">{courier.phoneNumber || "-"}</p>
    </div>
  </div>
);

// Component: Assign Courier Form
const AssignCourierForm = ({
  availableCouriers,
  selectedCourier,
  setSelectedCourier,
  onAssign,
  isSubmitting,
  t,
}: any) => (
  <div className="space-y-4">
    {availableCouriers.length > 0 ? (
      <>
        <div>
          <label className="text-sm font-medium">{t("admin.fleet.selectCourier") || "Wybierz kuriera"}</label>
          <select
            value={selectedCourier || ""}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">-- {t("admin.fleet.chooseCourier") || "Wybierz kuriera"} --</option>
            {availableCouriers.map((courier: any) => (
              <option key={courier.id} value={courier.id}>
                {courier.firstName} {courier.lastName} ({courier.email})
              </option>
            ))}
          </select>
        </div>
        <Button onClick={onAssign} disabled={!selectedCourier || isSubmitting} className="w-full">
          {isSubmitting ? t("common.saving") || "Zapisywanie..." : t("common.save") || "Zapisz"}
        </Button>
      </>
    ) : (
      <p className="text-center text-muted-foreground py-8">
        {t("admin.fleet.noCouriersAvailable") || "Brak dostępnych kurierów bez przypisanego pojazdu"}
      </p>
    )}
  </div>
);

