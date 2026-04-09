import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useKeycloak } from "@/hooks/useKeycloak";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@/components/ui/loaderComponent";
import { AlertCircle, Mail, Phone, Calendar, User, Users } from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { CourierTransportTab } from "@/components/profile/CourierTransportTab";
import { Button } from "@/components/ui/button";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "transport">(
    "profile",
  );
  const { user: initialUser, loading, error, refetch } = useProfile();
  const { updatePassword, keycloak, isInitialized } = useKeycloak();
  const { isCourier } = useUserRoles();
  const { t } = useTranslation();

  // Protect route - jeśli nie zalogowany, redirect
  if (isInitialized && !keycloak.isLogged) {
    navigate("/");
    return null;
  }

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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        {isCourier && (
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "profile"
                  ? "border-primary text-primary border-b-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("myProfile") || "Mój profil"}
            </button>
            <button
              onClick={() => setActiveTab("transport")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                activeTab === "transport"
                  ? "border-primary text-primary border-b-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("myTransport") || "Mój pojazd"}
            </button>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div>
            {!isCourier && (
              <h1 className="text-3xl font-bold">
                {t("myProfile") || "Mój profil"}
              </h1>
            )}
          </div>
          {user && activeTab === "profile" && (
            <div className="flex gap-2">
              <EditProfileModal
                user={user}
                onProfileUpdated={handleProfileUpdated}
              />
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

        {activeTab === "profile" && (
          <div className="bg-card space-y-4 rounded-lg border p-6">
            {/* Rola użytkownika */}
            <div className="space-y-2">
              <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                {t("accountType") || "Typ konta"}
              </label>
              <p className="text-lg font-medium">
                {user.userType === "COURIER"
                  ? t("roles.courier")
                  : user.userType === "ADMIN"
                    ? t("roles.admin")
                    : t("roles.customer")}
              </p>
            </div>

            {/* Imię i Nazwisko */}
            <div className="space-y-2 border-t pt-4">
              <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
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
          </div>
        )}

        {activeTab === "transport" && isCourier && <CourierTransportTab />}
      </div>
    </div>
  );
};
