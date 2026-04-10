import { useState, useMemo, useEffect } from "react";
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
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

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
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

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

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter((user) => {
      const firstName = (user.firstName || "").toLowerCase();
      const lastName = (user.lastName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const phoneNumber = (user.phoneNumber || "").toLowerCase();

      return (
        firstName.includes(filters.firstName.toLowerCase()) &&
        lastName.includes(filters.lastName.toLowerCase()) &&
        email.includes(filters.email.toLowerCase()) &&
        phoneNumber.includes(filters.phoneNumber.toLowerCase())
      );
    });

    if (sortField && sortOrder) {
      result.sort((a, b) => {
        const aValue = (a[sortField] || "").toString().toLowerCase();
        const bValue = (b[sortField] || "").toString().toLowerCase();

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, filters, sortField, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="text-sm font-medium">
            {t("admin.users.firstName") || "Imię"}
          </label>
          <Input
            placeholder={t("admin.users.filterByFirstName") || "Szukaj po imieniu..."}
            value={filters.firstName}
            onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("admin.users.lastName") || "Nazwisko"}
          </label>
          <Input
            placeholder={t("admin.users.filterByLastName") || "Szukaj po nazwisku..."}
            value={filters.lastName}
            onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("admin.users.email") || "Email"}
          </label>
          <Input
            placeholder={t("admin.users.filterByEmail") || "Szukaj po emailu..."}
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("admin.users.phoneNumber") || "Telefon"}
          </label>
          <Input
            placeholder={t("admin.users.filterByPhone") || "Szukaj po telefonie..."}
            value={filters.phoneNumber}
            onChange={(e) => setFilters({ ...filters, phoneNumber: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">{t("admin.fleet.itemsPerPage") || "Pozycji na stronę"}:</label>
          <select
            value={size}
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
            className="px-3 py-1 border rounded-md text-sm ml-2"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          {page * size + 1} - {Math.min((page + 1) * size, totalCount)} {t("admin.fleet.of") || "z"} {totalCount}
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
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
              <TableHead className="text-right">{t("common.actions") || "Akcje"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedUsers.length > 0 ? (
              filteredAndSortedUsers.map((user) => (
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
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(user)}
                      disabled={isDeleting === user.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  {t("admin.users.noUsers") || "Brak użytkowników"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
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
    handlePageChange,
    handleSizeChange,
    fetchUsersByTypePaged,
  } = useUsers();
  const [activeTab, setActiveTab] = useState<TabType>("customers");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Pobierz użytkowników po typie gdy zmienia się aktywna zakladka
  useEffect(() => {
    const userType = activeTab === "customers" ? "CUSTOMER" : "COURIER";
    fetchUsersByTypePaged(userType, 0, size);
  }, [activeTab]);

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
    <div className="container mx-auto max-w-6xl px-4 py-8">
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
              onPageChange={handlePageChange}
              onSizeChange={handleSizeChange}
              loading={loading}
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
              onPageChange={handlePageChange}
              onSizeChange={handleSizeChange}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}

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
