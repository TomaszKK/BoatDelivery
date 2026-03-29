import { useForm, Controller } from "react-hook-form"; // <-- DODANO Controller
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import type { OrderRequestDTO } from "@/types/OrderType";
import { useOrder } from "@/hooks/useOrder";

import worldCountries from "world-countries";
import Select from "react-select"; // <-- DODANO react-select

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. react-select wymaga formatu { value, label } dla opcji
const ALL_COUNTRIES = worldCountries
  .map((country) => ({
    value: country.cca3, 
    label: country.translations.pol?.common || country.name.common,
    cca2: country.cca2.toLowerCase(), // <-- Potrzebne do darmowego API z obrazkami flag
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'pl'));

// 2. Tworzymy customowy wygląd opcji (Prawdziwy obrazek HTML <img> zamiast tekstowego emoji)
const formatOptionLabel = ({ label, cca2 }: any) => (
  <div className="flex items-center gap-2">
    <img
      src={`https://flagcdn.com/w20/${cca2}.png`}
      srcSet={`https://flagcdn.com/w40/${cca2}.png 2x`}
      alt="flag"
      className="w-5 h-auto shadow-sm"
    />
    <span>{label}</span>
  </div>
);

export const OrderFormModal = ({ isOpen, onClose }: OrderFormModalProps) => {
  const { t } = useTranslation();
  const { createOrder } = useOrder();

  const locationSchema = z.object({
    streetAddress: z.string().min(3, t("validation.streetMin")),
    postalCode: z.string().regex(/^\d{2}-\d{3}$/, t("validation.postalCode")),
    city: z.string().min(2, t("validation.cityMin")),
    country: z.string().length(3, t("validation.countryMin", "Wybierz kraj")), 
  });

  const orderSchema = z.object({
    weight: z.number().positive(t("validation.positiveWeight")),
    volume: z.number().positive(t("validation.positiveVolume")),
    pickupLocation: locationSchema,
    deliveryLocation: locationSchema,
  });

  type OrderFormValues = z.infer<typeof orderSchema>;

  const {
    register,
    handleSubmit,
    reset,
    control, // <-- DODANO control z react-hook-form (wymagane dla Controllerów)
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      pickupLocation: { country: "POL" },
      deliveryLocation: { country: "POL" },
    },
  });

  const onSubmit = async (data: OrderFormValues) => {
    const payload: OrderRequestDTO = {
      ...data,
      customerId: "c1111111-1111-1111-1111-111111111111", // TODO: Auth context
    };

    try {
      await createOrder(payload);
      reset();
      onClose();
    } catch (error) {
      console.error("There was an error creating the order:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t("orders.newOrder")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("orders.weight")}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                {...register("weight", { valueAsNumber: true })}
                className="mt-1 w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.weight && (
                <p className="mt-1 text-xs text-red-500">{errors.weight.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                {t("orders.volume")}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                {...register("volume", { valueAsNumber: true })}
                className="mt-1 w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.volume && (
                <p className="mt-1 text-xs text-red-500">{errors.volume.message}</p>
              )}
            </div>
          </div>

          <hr className="my-4 border-gray-200 dark:border-slate-700" />

          {/* PICKUP LOCATION */}
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            📍 {t("orders.pickup")}
          </h3>
          <div>
            <input
              placeholder={t("orders.street")}
              {...register("pickupLocation.streetAddress")}
              className="w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            {errors.pickupLocation?.streetAddress && (
              <p className="mt-1 text-xs text-red-500">
                {errors.pickupLocation.streetAddress.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <input
                type="text"
                placeholder="00-000"
                maxLength={6}
                {...register("pickupLocation.postalCode", {
                  onChange: (e) => {
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.length > 2) {
                      val = val.slice(0, 2) + "-" + val.slice(2, 5);
                    }
                    e.target.value = val;
                  },
                })}
                className="w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.pickupLocation?.postalCode && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.pickupLocation.postalCode.message}
                </p>
              )}
            </div>
            <div className="w-1/3">
              <input
                placeholder={t("orders.city")}
                {...register("pickupLocation.city")}
                className="w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.pickupLocation?.city && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.pickupLocation.city.message}
                </p>
              )}
            </div>
            <div className="w-1/3">
              {/* 3. Zastępujemy <select> komponentem Controller + ReactSelect */}
              <Controller
                name="pickupLocation.country"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ALL_COUNTRIES}
                    formatOptionLabel={formatOptionLabel}
                    value={ALL_COUNTRIES.find((c) => c.value === field.value)}
                    onChange={(val) => field.onChange(val?.value)}
                    unstyled // Pozwala nam na użycie własnych klas Tailwind
                    classNames={{
                      control: () =>
                        "flex w-full items-center rounded-md border bg-white p-1.5 dark:border-slate-600 dark:bg-slate-900 dark:text-white",
                      menu: () =>
                        "mt-1 rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:text-white z-50",
                      option: ({ isFocused }) =>
                        `p-2 cursor-pointer ${isFocused ? "bg-blue-50 dark:bg-slate-700" : ""}`,
                      singleValue: () => "dark:text-white",
                    }}
                  />
                )}
              />
              {errors.pickupLocation?.country && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.pickupLocation.country.message}
                </p>
              )}
            </div>
          </div>

          <hr className="my-4 border-gray-200 dark:border-slate-700" />

          {/* DELIVERY LOCATION */}
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            🏁 {t("orders.delivery")}
          </h3>
          <div>
            <input
              placeholder={t("orders.street")}
              {...register("deliveryLocation.streetAddress")}
              className="w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            {errors.deliveryLocation?.streetAddress && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deliveryLocation.streetAddress.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <input
                type="text"
                placeholder="00-000"
                maxLength={6}
                {...register("deliveryLocation.postalCode", {
                  onChange: (e) => {
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.length > 2) {
                      val = val.slice(0, 2) + "-" + val.slice(2, 5);
                    }
                    e.target.value = val;
                  },
                })}
                className="w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.deliveryLocation?.postalCode && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.deliveryLocation.postalCode.message}
                </p>
              )}
            </div>
            <div className="w-1/3">
              <input
                placeholder={t("orders.city")}
                {...register("deliveryLocation.city")}
                className="w-full rounded-md border bg-white p-2 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {errors.deliveryLocation?.city && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.deliveryLocation.city.message}
                </p>
              )}
            </div>
            <div className="w-1/3">
              {/* 4. To samo dla sekcji dostawy */}
              <Controller
                name="deliveryLocation.country"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ALL_COUNTRIES}
                    formatOptionLabel={formatOptionLabel}
                    value={ALL_COUNTRIES.find((c) => c.value === field.value)}
                    onChange={(val) => field.onChange(val?.value)}
                    unstyled
                    classNames={{
                      control: () =>
                        "flex w-full items-center rounded-md border bg-white p-1.5 dark:border-slate-600 dark:bg-slate-900 dark:text-white",
                      menu: () =>
                        "mt-1 rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:text-white z-50",
                      option: ({ isFocused }) =>
                        `p-2 cursor-pointer ${isFocused ? "bg-blue-50 dark:bg-slate-700" : ""}`,
                      singleValue: () => "dark:text-white",
                    }}
                  />
                )}
              />
              {errors.deliveryLocation?.country && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.deliveryLocation.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 rounded-lg bg-gray-100 py-3 font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-slate-600"
            >
              {isSubmitting ? t("orders.sending") : t("orders.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};