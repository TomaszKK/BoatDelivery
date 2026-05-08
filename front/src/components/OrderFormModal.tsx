import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, type SetStateAction } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { MapPin, Flag, PackageCheck, Loader2, User, Wand2 } from "lucide-react";

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
  const { createOrder, extractOrderData } = useOrder();
  const navigate = useNavigate();
  const { user, loading: isUserLoading } = useProfile();
  const countries = getAllCountries();

  const [aiText, setAiText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      pickupLocation: { country: "POL" },
      deliveryLocation: { country: "POL" },
    },
  });

  const handleAiExtraction = async () => {
    if (!aiText.trim()) return;
    setIsAiLoading(true);
    toast.info(t("ai.analyzing", "AI analizuje Twój tekst..."));

    try {
      const data = await extractOrderData(aiText);
      if (data) {
        setValue("recipientFirstName", data.recipientFirstName || "");
        setValue("recipientLastName", data.recipientLastName || "");
        setValue("recipientEmail", data.recipientEmail || "");
        setValue("recipientPhone", data.recipientPhone || "");
        setValue("weight", data.weight || 5.0);
        setValue("volume", data.volume || 0.1);
        
        setValue("pickupLocation.streetAddress", data.pickupLocation?.streetAddress || "");
        setValue("pickupLocation.city", data.pickupLocation?.city || "");
        setValue("pickupLocation.postalCode", data.pickupLocation?.postalCode || "");
        
        setValue("deliveryLocation.streetAddress", data.deliveryLocation?.streetAddress || "");
        setValue("deliveryLocation.city", data.deliveryLocation?.city || "");
        setValue("deliveryLocation.postalCode", data.deliveryLocation?.postalCode || "");

        if (data.pickupLocation?.country) setValue("pickupLocation.country", data.pickupLocation.country);
        if (data.deliveryLocation?.country) setValue("deliveryLocation.country", data.deliveryLocation.country);

        toast.success(t("ai.success", "Formularz wypełniony automatycznie!"));
      }
    } catch (error) {
      toast.error(t("ai.error", "Wystąpił błąd podczas analizy tekstu."));
    } finally {
      setIsAiLoading(false);
    }
  };

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
      const createdOrder = await createOrder(payload);

      if (!createdOrder || !createdOrder.id) {
        throw new Error("Missing order ID in response");
      }

      reset();
      setAiText("");
      onClose();

      const calculatedAmount = data.weight * 5 + data.volume * 10;

      navigate(`/payment/${createdOrder.id}`, {
        state: {
          amount: calculatedAmount,
          customerEmail: user.email
        }
      });
    } catch (error) {
      console.error("There was an error creating the order:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setAiText("");
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
          <>
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-indigo-800">
                <Wand2 className="h-5 w-5" />
                <h3 className="font-bold">{t("ai.lazyOrderTitle", "Nie chce Ci się wpisywać? Użyj AI!")}</h3>
              </div>
              <p className="text-sm text-indigo-600 mb-3">
                {t("ai.lazyOrderDesc", "Wklej treść maila lub wiadomości, a my wypełnimy formularz za Ciebie (np. 'Wyślij paczkę 10kg z Piotrkowska 12, 90-001 Łódź do Krupówki 5, 34-500 Zakopane dla Jana Kowalskiego').")}
              </p>
              <Textarea 
                placeholder={t("ai.placeholder", "Wklej tekst do analizy...")}
                className="mb-3 bg-white"
                value={aiText}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setAiText(e.target.value)}
              />
              <Button 
                type="button" 
                variant="default" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleAiExtraction}
                disabled={isAiLoading || !aiText.trim()}
              >
                {isAiLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isAiLoading ? t("ai.analyzing", "Analizowanie danych...") : t("ai.fillForm", "Wypełnij formularz automatycznie")}
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};