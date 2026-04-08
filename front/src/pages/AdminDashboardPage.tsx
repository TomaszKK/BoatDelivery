import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAdminRouting } from "@/hooks/useAdminRouting";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch, Warehouse, CheckCircle2 } from "lucide-react";

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { stats, fetchStats, isLoadingStats } = useAdminRouting();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("admin.dashboardTitle")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("admin.dashboardDesc")}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("admin.pendingPickups")}
              </CardTitle>
              <PackageSearch className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.pendingPickups}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("admin.inSortingCenter")}
              </CardTitle>
              <Warehouse className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.inSortingCenter}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("admin.deliveredToday")}
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.delivered}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};