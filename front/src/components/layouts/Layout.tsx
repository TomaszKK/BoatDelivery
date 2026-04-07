import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom"; // Dodano useNavigate
import { Pathnames } from "@/router/pathnames";
import { ModeToggle } from "../ModeToggle";
import { AuthButtons } from "../auth/AuthButtons";
import { BdLogo } from "@/components/ui/BdLogo.tsx";
import { useKeycloak } from "@/hooks/useKeycloak";
import { useUserRoles } from "@/hooks/useUserRoles";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose, // Dodano SheetClose do automatycznego zamykania menu mobilnego
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";

import {
  LanguagesIcon,
  MenuIcon,
  TruckIcon,
  PackageSearchIcon,
  PackageIcon,
  LayoutDashboardIcon,
  UsersIcon,
  MapPinIcon,
} from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // Hook do nawigacji z kodu
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { keycloak } = useKeycloak();
  const { isCustomer, isCourier, isAdmin } = useUserRoles();
  const isLogged = keycloak.isLogged;

  // Wyciąganie nazwy usera
  const tokenParsed = (keycloak as any)?.tokenParsed;
  const username =
    tokenParsed?.preferred_username || tokenParsed?.given_name || "Użytkownik";
  
  // Dynamiczne ustalenie tekstu roli
  let activeRoleLabel = "customer";
  if (isAdmin) activeRoleLabel = "admin";
  else if (isCourier) activeRoleLabel = "courier";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onClickLanguageChange = async (value: string) => {
    try {
      await i18n.changeLanguage(value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-background grid min-h-[100dvh] grid-rows-[auto_1fr_auto] font-sans antialiased">
      {/* Poprawiona składnia backticków w className */}
      <header
        className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur transition-all duration-200 ${
          isScrolled ? "border-b shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            
            {/* MENU MOBILNE */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:text-primary">
                    <MenuIcon className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-primary text-left text-xl font-bold">
                      BoatDelivery
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8 flex flex-col space-y-4">
                    {isLogged && (
                      <div className="border-b pb-4">
                        <p className="text-muted-foreground text-sm">{t("loggedAs")}</p>
                        {/* Poprawiona składnia dla roli */}
                        <p className="font-medium">
                          {username} ({t(`roles.${activeRoleLabel}`)})
                        </p>
                      </div>
                    )}

                    {isLogged && isCustomer && (
                      <>
                        <SheetClose asChild>
                          <Link to={Pathnames.customer.track} className="hover:text-primary flex items-center gap-2">
                            <PackageSearchIcon className="h-5 w-5" /> {t("trackPackage")}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={Pathnames.customer.orders} className="hover:text-primary flex items-center gap-2">
                            <PackageIcon className="h-5 w-5" /> {t("myShipments")}
                          </Link>
                        </SheetClose>
                      </>
                    )}

                    {isLogged && isCourier && (
                      <>
                        <SheetClose asChild>
                          <Link to={Pathnames.courier.route} className="hover:text-primary flex items-center gap-2">
                            <MapPinIcon className="h-5 w-5" /> {t("myRoute")}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={Pathnames.courier.deliveries} className="hover:text-primary flex items-center gap-2">
                            <TruckIcon className="h-5 w-5" /> {t("activeDeliveries")}
                          </Link>
                        </SheetClose>
                      </>
                    )}

                    {isLogged && isAdmin && (
                      <>
                        <SheetClose asChild>
                          <Link to={Pathnames.admin.dashboard} className="hover:text-primary flex items-center gap-2">
                            <LayoutDashboardIcon className="h-5 w-5" /> {t("dashboard")}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={Pathnames.admin.accounts} className="hover:text-primary flex items-center gap-2">
                            <UsersIcon className="h-5 w-5" /> {t("manageUsers")}
                          </Link>
                        </SheetClose>
                      </>
                    )}

                    {!isLogged && (
                      <div className="flex flex-col gap-2 pt-4">
                        <AuthButtons />
                      </div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* LOGO (Automatycznie kieruje na dedykowany Home w zaleznosci od roli) */}
            <Link
              to={isAdmin ? Pathnames.admin.dashboard : isCourier ? Pathnames.courier.route : Pathnames.customer.home}
              className="text-primary flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
            >
              <BdLogo className="h-20 w-20" />
              BoatDelivery
            </Link>
          </div>

          {/* NAWIGACJA DESKTOPOWA */}
          <div className="hidden items-center gap-6 lg:flex">
            <TooltipProvider delayDuration={200}>
              
              {isLogged && isCustomer && (
                <>
                  {/* Zamiast zagnieżdżać Button w Link, używamy onClick + navigate */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => navigate(Pathnames.customer.track)}>
                        <PackageSearchIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t("trackPackage")}</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => navigate(Pathnames.customer.orders)}>
                        <PackageIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t("myShipments")}</p></TooltipContent>
                  </Tooltip>
                </>
              )}

              {isLogged && isCourier && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => navigate(Pathnames.courier.route)}>
                        <MapPinIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t("myRoute")}</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => navigate(Pathnames.courier.deliveries)}>
                        <TruckIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t("activeDeliveries")}</p></TooltipContent>
                  </Tooltip>
                </>
              )}

              {isLogged && isAdmin && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => navigate(Pathnames.admin.dashboard)}>
                        <LayoutDashboardIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t("dashboard")}</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => navigate(Pathnames.admin.accounts)}>
                        <UsersIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t("manageUsers")}</p></TooltipContent>
                  </Tooltip>
                </>
              )}
            </TooltipProvider>

            <div className="bg-border mx-2 h-6 w-px"></div>

            {/* Zmiana Języka */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <LanguagesIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onClickLanguageChange("pl")} className="cursor-pointer">
                  {t("polish")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onClickLanguageChange("en")} className="cursor-pointer">
                  {t("english")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />
            <AuthButtons />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <Toaster />

      <footer className="bg-muted/40 border-t py-6 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} BoatDelivery. {t("allRightsReserved")}
        </p>
      </footer>
    </div>
  );
};