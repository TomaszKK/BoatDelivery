import { Button } from "@/components/ui/button";
import { useKeycloak } from "@/hooks/useKeycloak";
import { useTranslation } from "react-i18next";
import { LogOutIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const AuthButtons = () => {
  const { isLogged, login, register, logout, keycloak, isInitialized } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Podczas inicjalizacji nie pokazujemy nic
  if (!isInitialized) {
    return null;
  }

  if (!isLogged) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={login}
          className="cursor-pointer"
        >
          {t("login")}
        </Button>
        <Button
          onClick={register}
          className="cursor-pointer"
        >
          {t("register")}
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {keycloak.user?.preferred_username || keycloak.user?.name || t("myAccount")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {keycloak.user?.email && (
          <div className="text-muted-foreground px-2 py-1.5 text-sm">
            <p className="text-foreground font-semibold">{keycloak.user.email}</p>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          <UserIcon className="mr-2 h-4 w-4" />
          {t("myProfile") || "Mój profil"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          {t("logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};



