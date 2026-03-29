import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOrder } from "@/hooks/useOrder";
import { OrderFormModal } from "@/components/OrderFormModal";

export const MyOrdersPage = () => {
  const { t } = useTranslation();
  const { orders, getAllOrders } = useOrder();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="min-h-screen p-6 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold">{t("orders.yourOrders")}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            + {t("orders.newOrder")}
          </button>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400">
            {t("orders.noOrders")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {orders.map((o) => (
              <div
                key={o.trackingNumber}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                    {o.trackingNumber}
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 dark:bg-green-900/40 dark:text-green-300">
                    {o.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    📦{" "}
                    <span className="text-gray-400 dark:text-gray-500">
                      {t("orders.weightInfo")}
                    </span>{" "}
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {o.weight} kg
                    </span>
                  </p>

                  {o.deliveryLocation && (
                    <p>
                      📍{" "}
                      <span className="text-gray-400 dark:text-gray-500">
                        {t("orders.to")}
                      </span>{" "}
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {o.deliveryLocation.city},{" "}
                        {o.deliveryLocation.streetAddress}
                      </span>
                    </p>
                  )}

                  <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400 dark:border-slate-700 dark:text-gray-500">
                    {t("orders.created")}{" "}
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
