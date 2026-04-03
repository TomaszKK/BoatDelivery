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
  const { updateProfile, loading, error, success } = useProfileUpdate();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
  });

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
              className="border-input w-full rounded-md border px-3 py-2 text-sm"
              placeholder={t("firstName") || "Imię"}
            />
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
              className="border-input w-full rounded-md border px-3 py-2 text-sm"
              placeholder={t("lastName") || "Nazwisko"}
            />
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
              className="border-input w-full rounded-md border px-3 py-2 text-sm"
              placeholder={t("phone") || "Numer telefonu"}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-600">
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
