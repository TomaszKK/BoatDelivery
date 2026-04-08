import { Button } from "@/components/ui/button";
import { useKeycloak } from "@/hooks/useKeycloak";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";

export const AuthButtons = () => {
  const { isLogged, login, register, logout, keycloak, isInitialized } =
    useKeycloak();
  const { t } = useTranslation();

  if (!isInitialized) {
    return null;
  }

  if (!isLogged) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={login} className="cursor-pointer">
          {t("login")}
        </Button>
        <Button onClick={register} className="cursor-pointer">
          {t("register")}
        </Button>
      </div>
    );
  }

  const firstName = keycloak.user?.given_name || "";
  const lastName = keycloak.user?.family_name || "";
  const fullName =
    `${firstName} ${lastName}`.trim() ||
    keycloak.user?.preferred_username ||
    t("user");

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">{fullName}</span>
      <Button
        variant="destructive"
        size="sm"
        onClick={logout}
        className="cursor-pointer gap-2"
      >
        <LogOut className="h-4 w-4" />
        {t("logOut")}
      </Button>
    </div>
  );
};
