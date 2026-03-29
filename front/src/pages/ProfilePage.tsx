import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@/components/ui/loaderComponent";
import { AlertCircle, Mail, Phone, Calendar } from "lucide-react";

export const ProfilePage = () => {
  const { user, loading, error } = useProfile();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Brak danych profilu</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("myProfile") || "Mój profil"}</h1>
          <p className="text-muted-foreground mt-2">Twoje informacje konta</p>
        </div>

        <div className="space-y-4 bg-card border rounded-lg p-6">
          {/* Imię i Nazwisko */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("fullName") || "Pełne imię"}
            </label>
            <p className="text-lg font-medium">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : "Nie podano"}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2 pt-4 border-t">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t("email") || "Email"}
            </label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          {/* Numer telefonu */}
          {user.phoneNumber && (
            <div className="space-y-2 pt-4 border-t">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t("phone") || "Telefon"}
              </label>
              <p className="text-lg font-medium">{user.phoneNumber}</p>
            </div>
          )}

          {/* Data utworzenia konta */}
          {user.createdAt && (
            <div className="space-y-2 pt-4 border-t">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("accountCreated") || "Konto utworzone"}
              </label>
              <p className="text-lg font-medium">
                {new Date(user.createdAt).toLocaleDateString("pl-PL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {/* ID użytkownika */}
          <div className="space-y-2 pt-4 border-t">
            <label className="text-sm font-medium text-muted-foreground">ID</label>
            <p className="text-sm font-mono text-muted-foreground break-all">{user.id}</p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
              Debug: Pełne dane JSON
            </summary>
            <pre className="mt-2 text-xs overflow-auto max-h-48 p-2 bg-background border rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

