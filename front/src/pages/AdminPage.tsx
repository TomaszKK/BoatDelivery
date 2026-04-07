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

export const AdminPage = () => {
  const { t } = useTranslation();
  const { users, loading, error } = useUsers();


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

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-bold">{t("admin.users.title") || "Zarządzanie Użytkownikami"}</h1>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.users.id") || "ID"}</TableHead>
              <TableHead>{t("admin.users.email") || "Email"}</TableHead>
              <TableHead>{t("admin.users.firstName") || "Imię"}</TableHead>
              <TableHead>{t("admin.users.lastName") || "Nazwisko"}</TableHead>
              <TableHead>{t("admin.users.phoneNumber") || "Telefon"}</TableHead>
              <TableHead>{t("admin.users.createdAt") || "Data Utworzenia"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm">{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName || "-"}</TableCell>
                  <TableCell>{user.lastName || "-"}</TableCell>
                  <TableCell>{user.phoneNumber || "-"}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("pl-PL")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {t("admin.users.noUsers") || "Brak użytkowników"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {t("admin.users.totalUsers") || "Razem użytkowników"}: {users.length}
      </div>
  );
};

