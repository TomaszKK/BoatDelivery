import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import type { OrderRequestDTO } from "@/types/OrderType";
import { useOrder } from "@/hooks/useOrder";
import { getAllCountries } from "@/utils/countries";
import Select from "react-select";

// Shadcn UI Imports (tylko te, które działają!)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Icons
import { MapPin, Flag, PackageCheck } from "lucide-react";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Komponent do renderowania opcji z flagą
const formatOptionLabel = ({ label, cca2 }: any) => (
  <div className="flex items-center gap-2">
    <img
      src={`https://flagcdn.com/w20/${cca2}.png`}
      srcSet={`https://flagcdn.com/w40/${cca2}.png 2x`}
      alt="flag"
      className="h-auto w-5 shadow-sm"
    />
    <span>{label}</span>
  </div>
);

export const OrderFormModal = ({ isOpen, onClose }: OrderFormModalProps) => {
  const { t } = useTranslation();
  const { createOrder } = useOrder();
  const countries = getAllCountries();

  const locationSchema = z.object({
    streetAddress: z.string().min(3, t("validation.streetMin")),
    postalCode: z.string().regex(/^\d{2}-\d{3}$/, t("validation.postalCode")),
    city: z.string().min(2, t("validation.cityMin")),
    country: z.string().length(3, t("validation.countryMin")),
  });

  const orderSchema = z.object({
    weight: z
      .number({ message: t("validation.positiveWeight") })
      .positive(t("validation.positiveWeight")),
    volume: z
      .number({ message: t("validation.positiveVolume") })
      .positive(t("validation.positiveVolume")),
    pickupLocation: locationSchema,
    deliveryLocation: locationSchema,
  });

  type OrderFormValues = z.infer<typeof orderSchema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto sm:rounded-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <PackageCheck className="text-primary h-6 w-6" />
            {t("orders.newOrder")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* WAGA I OBJĘTOŚĆ */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {" "}
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium">
                {t("orders.weight")}
              </label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                {...register("weight", { valueAsNumber: true })}
                className={
                  errors.weight
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.weight && (
                <p className="text-destructive text-sm font-medium">
                  {errors.weight.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium">
                {t("orders.volume")}
              </label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                {...register("volume", { valueAsNumber: true })}
                className={
                  errors.volume
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.volume && (
                <p className="text-destructive text-sm font-medium">
                  {errors.volume.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* PICKUP LOCATION */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-blue-500" />
              {t("orders.pickup")}
            </h3>

            <div className="space-y-2">
              <Input
                placeholder={t("orders.street")}
                {...register("pickupLocation.streetAddress")}
                className={
                  errors.pickupLocation?.streetAddress
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.pickupLocation?.streetAddress && (
                <p className="text-destructive text-sm font-medium">
                  {errors.pickupLocation.streetAddress.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {" "}
              <div className="space-y-2">
                <Input
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
                  className={
                    errors.pickupLocation?.postalCode
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.pickupLocation?.postalCode && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.pickupLocation.postalCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder={t("orders.city")}
                  {...register("pickupLocation.city")}
                  className={
                    errors.pickupLocation?.city
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.pickupLocation?.city && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.pickupLocation.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Controller
                  name="pickupLocation.country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countries}
                      formatOptionLabel={formatOptionLabel}
                      value={countries.find((c) => c.value === field.value)}
                      onChange={(val) => field.onChange(val?.value)}
                      unstyled
                      classNames={{
                        control: () =>
                          `flex w-full items-center rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${errors.pickupLocation?.country ? "border-destructive focus-within:ring-destructive" : "border-input"}`,
                        menu: () =>
                          "mt-1 rounded-md border bg-popover text-popover-foreground shadow-md z-50",
                        option: ({ isFocused }) =>
                          `p-2 text-sm cursor-pointer ${isFocused ? "bg-accent text-accent-foreground" : ""}`,
                        singleValue: () => "text-foreground",
                      }}
                    />
                  )}
                />
                {errors.pickupLocation?.country && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.pickupLocation.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* DELIVERY LOCATION */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Flag className="h-4 w-4 text-red-500" />
              {t("orders.delivery")}
            </h3>

            <div className="space-y-2">
              <Input
                placeholder={t("orders.street")}
                {...register("deliveryLocation.streetAddress")}
                className={
                  errors.deliveryLocation?.streetAddress
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.deliveryLocation?.streetAddress && (
                <p className="text-destructive text-sm font-medium">
                  {errors.deliveryLocation.streetAddress.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {" "}
              <div className="space-y-2">
                <Input
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
                  className={
                    errors.deliveryLocation?.postalCode
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.deliveryLocation?.postalCode && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.deliveryLocation.postalCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder={t("orders.city")}
                  {...register("deliveryLocation.city")}
                  className={
                    errors.deliveryLocation?.city
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.deliveryLocation?.city && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.deliveryLocation.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Controller
                  name="deliveryLocation.country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countries}
                      formatOptionLabel={formatOptionLabel}
                      value={countries.find((c) => c.value === field.value)}
                      onChange={(val) => field.onChange(val?.value)}
                      unstyled
                      classNames={{
                        control: () =>
                          `flex w-full items-center rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${errors.deliveryLocation?.country ? "border-destructive focus-within:ring-destructive" : "border-input"}`,
                        menu: () =>
                          "mt-1 rounded-md border bg-popover text-popover-foreground shadow-md z-50",
                        option: ({ isFocused }) =>
                          `p-2 text-sm cursor-pointer ${isFocused ? "bg-accent text-accent-foreground" : ""}`,
                        singleValue: () => "text-foreground",
                      }}
                    />
                  )}
                />
                {errors.deliveryLocation?.country && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.deliveryLocation.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-1/3"
              onClick={onClose}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="w-2/3" disabled={isSubmitting}>
              {isSubmitting ? t("orders.sending") : t("orders.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
