import { useProfile } from "@/hooks/useProfile";
import { useKeycloak } from "@/hooks/useKeycloak";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@/components/ui/loaderComponent";
import { AlertCircle, Mail, Phone, Calendar } from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Button } from "@/components/ui/button";

export const ProfilePage = () => {
  const { user: initialUser, loading, error, refetch } = useProfile();
  const { updatePassword } = useKeycloak();
  const { t } = useTranslation();

  const handleProfileUpdated = () => {
    refetch();
  };

  const handleChangePassword = () => {
    updatePassword();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!initialUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground text-center">Brak danych profilu</p>
      </div>
    );
  }

  const user = initialUser;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{t("myProfile") || "Mój profil"}</h1>
            <p className="text-muted-foreground mt-2">Twoje informacje konta</p>
          </div>
          {user && (
            <div className="flex gap-2">
              <EditProfileModal user={user} onProfileUpdated={handleProfileUpdated} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangePassword}
                className="gap-2"
              >
                {t("changePassword") || "Zmień hasło"}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-card space-y-4 rounded-lg border p-6">
          {/* Imię i Nazwisko */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              {t("fullName") || "Pełne imię"}
            </label>
            <p className="text-lg font-medium">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : "Nie podano"}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              {t("email") || "Email"}
            </label>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          {/* Numer telefonu */}
          {user.phoneNumber && (
            <div className="space-y-2 border-t pt-4">
              <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                {t("phone") || "Telefon"}
              </label>
              <p className="text-lg font-medium">{user.phoneNumber}</p>
            </div>
          )}

          {/* Data utworzenia konta */}
          {user.createdAt && (
            <div className="space-y-2 border-t pt-4">
              <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
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
          <div className="space-y-2 border-t pt-4">
            <label className="text-muted-foreground text-sm font-medium">
              ID
            </label>
            <p className="text-muted-foreground font-mono text-sm break-all">
              {user.id}
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
          <details>
            <summary className="text-muted-foreground cursor-pointer text-sm font-medium">
              Debug: Pełne dane JSON
            </summary>
            <pre className="bg-background mt-2 max-h-48 overflow-auto rounded border p-2 text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};
