import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAdminRouting } from "@/hooks/useAdminRouting";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Settings2, Zap, BrainCircuit, Route, Swords } from "lucide-react";
import type { AlgorithmType } from "@/types/RoutingTypes";
import { t } from "i18next";

const algorithms: {
  type: AlgorithmType;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    type: "TIMEFOLD_ADVANCED",
    label: "Timefold AI",
    icon: <BrainCircuit className="mb-2 h-6 w-6" />,
    desc: t("admin.timefoldDesc"),
  },
  {
    type: "GREEDY_SIMPLE",
    label: "Greedy",
    icon: <Route className="mb-2 h-6 w-6" />,
    desc: t("admin.greedyDesc"),
  },
  {
    type: "BRUTE_FORCE",
    label: "Brute Force",
    icon: <Swords className="mb-2 h-6 w-6" />,
    desc: t("admin.bruteForceDesc"),
  },
];

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { currentAlgorithm, fetchAlgorithm, changeAlgorithm, forceOptimize } =
    useAdminRouting();

  useEffect(() => {
    fetchAlgorithm();
  }, [fetchAlgorithm]);

  return (
    <div className="text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("admin.dashboard")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("admin.dashboardDesc")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* KARTA: WYBÓR ALGORYTMU */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="text-primary h-5 w-5" />
                {t("admin.algorithmSelection")}
              </CardTitle>
              <CardDescription>
                {t("admin.algorithmSelectionDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {algorithms.map((algo) => {
                  const isActive = currentAlgorithm === algo.type;
                  return (
                    <div
                      key={algo.type}
                      onClick={() => !isActive && changeAlgorithm(algo.type)}
                      className={`relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                          >
                            {algo.icon}
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${isActive ? "text-primary" : ""}`}
                            >
                              {algo.label}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {algo.desc}
                            </p>
                          </div>
                        </div>
                        {/* Wskaźnik "Aktywne" */}
                        {isActive && (
                          <div className="bg-primary ring-primary/20 absolute top-4 right-4 h-3 w-3 animate-pulse rounded-full ring-4" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* KARTA: WYMUSZENIE OPTYMALIZACJI */}
          <Card className="flex flex-col border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                {t("admin.forceOptimize")}
              </CardTitle>
              <CardDescription>{t("admin.forceOptimizeDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center p-6 text-center">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {t("admin.forceOptimizeWarning")}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={forceOptimize}
                className="w-full gap-2 bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                <Zap className="h-4 w-4" />
                {t("admin.forceOptimizeButton")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
