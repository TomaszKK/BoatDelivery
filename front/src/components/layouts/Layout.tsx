import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pathnames } from "@/router/pathnames";
import { ModeToggle } from "../ModeToggle";
import { AuthButtons } from "../auth/AuthButtons";
import { BdLogo } from "@/components/ui/BdLogo.tsx";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";

import {
  UserIcon,
  LanguagesIcon,
  MenuIcon,
  //MapIcon,
  TruckIcon,
  PackageSearchIcon,
  PackageIcon,
  LayoutDashboardIcon,
  UsersIcon,
  LogOutIcon,
  MapPinIcon,
} from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  // MOCKED DATA - DO USUNIĘCIA I ZASTĄPIENIA PRAWDZIWYMI DANYMI Z AUTHSERVICE
  const isLogged = true;
  const isCustomer = true;
  const isCourier = false;
  const isAdmin = false;
  const account = { username: "Piotr", role: "admin" };


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onClickLanguageChange = async (value: string) => {
    try {
      i18n.changeLanguage(value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col font-sans antialiased">
      <header
        className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur transition-all duration-200 ${
          isScrolled ? "border-b shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-primary"
                  >
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
                    {isLogged && account && (
                      <div className="border-b pb-4">
                        <p className="text-muted-foreground text-sm">
                          {t("loggedAs")}
                        </p>
                        <p className="font-medium">
                          {account.username} ({t(account.role)})
                        </p>
                      </div>
                    )}

                    {isLogged && isCustomer && (
                      <>
                        <a
                          href={Pathnames.customer.track}
                          className="hover:text-primary flex items-center gap-2"
                        >
                          <PackageSearchIcon className="h-5 w-5" />{" "}
                          {t("trackPackage")}
                        </a>
                        <a
                          href={Pathnames.customer.orders}
                          className="hover:text-primary flex items-center gap-2"
                        >
                          <PackageIcon className="h-5 w-5" /> {t("myShipments")}
                        </a>
                      </>
                    )}

                    {isLogged && isCourier && (
                      <>
                        <a
                          href={Pathnames.courier.route}
                          className="hover:text-primary flex items-center gap-2"
                        >
                          <MapPinIcon className="h-5 w-5" /> {t("myRoute")}
                        </a>
                        <a
                          href={Pathnames.courier.deliveries}
                          className="hover:text-primary flex items-center gap-2"
                        >
                          <TruckIcon className="h-5 w-5" />{" "}
                          {t("activeDeliveries")}
                        </a>
                      </>
                    )}

                    {isLogged && isAdmin && (
                      <>
                        <a
                          href={Pathnames.admin.dashboard}
                          className="hover:text-primary flex items-center gap-2"
                        >
                          <LayoutDashboardIcon className="h-5 w-5" />{" "}
                          {t("dashboard")}
                        </a>
                        <a
                          href={Pathnames.admin.accounts}
                          className="hover:text-primary flex items-center gap-2"
                        >
                          <UsersIcon className="h-5 w-5" /> {t("manageUsers")}
                        </a>
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

            <a
              href={
                isAdmin ? Pathnames.admin.dashboard : Pathnames.customer.home
              }
              className="text-primary flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
            >
              <BdLogo className="h-20 w-20" />
              BoatDelivery
            </a>
          </div>

          {/* Środek/Prawa strona: Nawigacja Desktopowa */}
          <div className="hidden items-center gap-6 lg:flex">
            <TooltipProvider delayDuration={200}>
              {/* Ikony dla Klienta */}
              {isLogged && isCustomer && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = Pathnames.customer.track)
                        }
                      >
                        <PackageSearchIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("trackPackage")}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = Pathnames.customer.orders)
                        }
                      >
                        <PackageIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("myShipments")}</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              {isLogged && isCourier && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = Pathnames.courier.route)
                        }
                      >
                        <MapPinIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("myRoute")}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = Pathnames.courier.deliveries)
                        }
                      >
                        <TruckIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("activeDeliveries")}</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              {isLogged && isAdmin && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = Pathnames.admin.dashboard)
                        }
                      >
                        <LayoutDashboardIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("dashboard")}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          (window.location.href = Pathnames.admin.accounts)
                        }
                      >
                        <UsersIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("manageUsers")}</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </TooltipProvider>

            <div className="bg-border mx-2 h-6 w-px"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <LanguagesIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onClickLanguageChange("pl")}
                  className="cursor-pointer"
                >
                  {t("polish")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onClickLanguageChange("en")}
                  className="cursor-pointer"
                >
                  {t("english")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />

            <AuthButtons />
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>

      <Toaster />

      <footer className="bg-muted/40 border-t py-6 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} BoatDelivery.{" "}
          {t("allRightsReserved")}
        </p>
      </footer>
    </div>
  );
};
