import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import { useKeycloak } from "@/hooks/useKeycloak";
import type { User } from "@/types/UserType";
import { Edit2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EditProfileModalProps {
  user: User;
  onProfileUpdated: (updatedUser: User) => void;
}

export const EditProfileModal = ({
  user,
  onProfileUpdated,
}: EditProfileModalProps) => {
  const { t } = useTranslation();
  const { refreshToken } = useKeycloak();
  const { updateProfile, loading, error, fieldErrors, success } =
    useProfileUpdate(refreshToken);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
  });

  // Funkcja do pobrania błędu dla konkretnego pola
  const getFieldError = (fieldName: string): string | null => {
    if (!fieldErrors) return null;
    const fieldError = fieldErrors.find((fe) => fe.field === fieldName);
    return fieldError?.message || null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = await updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    });

    if (updatedUser) {
      onProfileUpdated(updatedUser);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit2 className="h-4 w-4" />
          {t("edit") || "Edytuj"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editProfile") || "Edytuj profil"}</DialogTitle>
          <DialogDescription>
            {t("editProfileDesc") || "Zmień dane swojego profilu"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {error && !fieldErrors && (
            <div className="flex items-center gap-2 rounded-md border-2 border-red-600 bg-transparent p-3 dark:border-red-500">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Imię */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              {t("firstName") || "Imię"}
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full rounded-md border-2 px-3 py-2 text-sm transition-colors ${
                getFieldError("firstName")
                  ? "text-foreground border-red-600 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none dark:bg-slate-900"
                  : "border-input bg-background text-foreground focus:ring-primary focus:ring-2 focus:outline-none"
              }`}
              placeholder={t("firstName") || "Imię"}
            />
            {getFieldError("firstName") && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {getFieldError("firstName")}
              </p>
            )}
          </div>

          {/* Nazwisko */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              {t("lastName") || "Nazwisko"}
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full rounded-md border-2 px-3 py-2 text-sm transition-colors ${
                getFieldError("lastName")
                  ? "text-foreground border-red-600 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none dark:bg-slate-900"
                  : "border-input bg-background text-foreground focus:ring-primary focus:ring-2 focus:outline-none"
              }`}
              placeholder={t("lastName") || "Nazwisko"}
            />
            {getFieldError("lastName") && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {getFieldError("lastName")}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t("email") || "Email"}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full rounded-md border-2 px-3 py-2 text-sm transition-colors ${
                getFieldError("email")
                  ? "text-foreground border-red-600 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none dark:bg-slate-900"
                  : "border-input bg-background text-foreground focus:ring-primary focus:ring-2 focus:outline-none"
              }`}
              placeholder={t("email") || "Email"}
            />
            {getFieldError("email") && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {getFieldError("email")}
              </p>
            )}
          </div>

          {/* Telefon */}
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              {t("phone") || "Numer telefonu"}
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full rounded-md border-2 px-3 py-2 text-sm transition-colors ${
                getFieldError("phoneNumber")
                  ? "text-foreground border-red-600 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none dark:bg-slate-900"
                  : "border-input bg-background text-foreground focus:ring-primary focus:ring-2 focus:outline-none"
              }`}
              placeholder={t("phone") || "Numer telefonu"}
            />
            {getFieldError("phoneNumber") && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {getFieldError("phoneNumber")}
              </p>
            )}
          </div>

          {/* Success */}
          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-600 dark:bg-slate-900">
              <p className="text-sm text-green-600 dark:text-green-400">
                {t("profileUpdatedSuccess") ||
                  "Profil zaktualizowany pomyślnie!"}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t("cancel") || "Anuluj"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("saving") || "Zapisywanie..."
                : t("save") || "Zapisz"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
