import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import type { OrderRequestDTO } from "@/types/OrderType";
import { useOrder } from "@/hooks/useOrder";
import { useProfile } from "@/hooks/useProfile";
import { getAllCountries } from "@/utils/countries";
import Select from "react-select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { MapPin, Flag, PackageCheck, Loader2, User } from "lucide-react";

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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
    const navigate = useNavigate();
    const { user, loading: isUserLoading } = useProfile();
    const countries = getAllCountries();

    const locationSchema = z.object({
        streetAddress: z.string().min(3, t("validation.streetMin", "Ulica jest za krótka")),
        postalCode: z.string().regex(/^\d{2}-\d{3}$/, t("validation.postalCode", "Niepoprawny kod")),
        city: z.string().min(2, t("validation.cityMin", "Miasto za krótkie")),
        country: z.string().length(3, t("validation.countryMin", "Wybierz kraj")),
    });

    const orderSchema = z.object({
        weight: z
            .number({ message: t("validation.positiveWeight", "Waga musi być dodatnia") })
            .positive(t("validation.positiveWeight", "Waga musi być dodatnia")),
        volume: z
            .number({ message: t("validation.positiveVolume", "Objętość musi być dodatnia") })
            .positive(t("validation.positiveVolume", "Objętość musi być dodatnia")),
        // DODANE POLA ODBIORCY
        recipientFirstName: z.string().min(2, t("validation.required", "Wymagane")),
        recipientLastName: z.string().min(2, t("validation.required", "Wymagane")),
        recipientEmail: z.string().email(t("validation.email", "Niepoprawny email")),
        recipientPhone: z.string().min(9, t("validation.phone", "Niepoprawny telefon")),
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
        if (!user || !user.id) {
            toast.error(
                t(
                    "errors.userNotFound",
                    "Nie można zidentyfikować użytkownika. Spróbuj zalogować się ponownie.",
                ),
            );
            return;
        }

        const payload: OrderRequestDTO = {
            ...data,
            customerId: user.id,
        };

      try {
        // Zakładam, że createOrder zwraca utworzony obiekt z backendu (z ID lub trackingNumber)
        const createdOrder = await createOrder(payload);
        reset();
        onClose();

        // Tymczasowo obliczamy kwotę (np. na podstawie wagi).
        const calculatedAmount = data.weight * 5 + data.volume * 10;

        // Przekierowanie na nową podstronę płatności, przekazując dane w 'state'
        navigate(`/payment/${createdOrder.id}`, {
          state: {
            amount: calculatedAmount,
            customerEmail: user.email
          }
        });
      } catch (error) {
        console.error("There was an error creating the order:", error);
        toast.error("Błąd podczas tworzenia zamówienia.");
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

                {isUserLoading ? (
                    <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
                        <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                        <p>{t("orders.loadingProfile", "Pobieranie danych użytkownika...")}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* 1. DANE ODBIORCY */}
                        <div className="space-y-4">
                            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                                <User className="h-4 w-4 text-emerald-500" />
                                {t("orders.recipientData", "Dane Odbiorcy")}
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Input
                                        placeholder={t("orders.firstName", "Imię")}
                                        {...register("recipientFirstName")}
                                        className={errors.recipientFirstName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.recipientFirstName && (
                                        <p className="text-destructive text-sm font-medium">{errors.recipientFirstName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder={t("orders.lastName", "Nazwisko")}
                                        {...register("recipientLastName")}
                                        className={errors.recipientLastName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.recipientLastName && (
                                        <p className="text-destructive text-sm font-medium">{errors.recipientLastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder={t("orders.email", "Adres Email")}
                                        {...register("recipientEmail")}
                                        className={errors.recipientEmail ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.recipientEmail && (
                                        <p className="text-destructive text-sm font-medium">{errors.recipientEmail.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="tel"
                                        placeholder={t("orders.phone", "Numer Telefonu")}
                                        {...register("recipientPhone")}
                                        className={errors.recipientPhone ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.recipientPhone && (
                                        <p className="text-destructive text-sm font-medium">{errors.recipientPhone.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* 2. WAGA I OBJĘTOŚĆ */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                        {/* 3. PICKUP LOCATION */}
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

                        {/* 4. DELIVERY LOCATION */}
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
                )}
            </DialogContent>
        </Dialog>
    );
};