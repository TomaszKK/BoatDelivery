import { useState, useCallback } from "react";
import { apiForAuthenticated } from "@/api/api.config";
import axios from "axios";
import type { User } from "@/types/UserType";

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

interface FieldError {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

interface UseProfileUpdateState {
  loading: boolean;
  error: string | null;
  fieldErrors: FieldError[] | null;
  success: boolean;
}

export const useProfileUpdate = (onSuccess?: () => Promise<void>) => {
  const [state, setState] = useState<UseProfileUpdateState>({
    loading: false,
    error: null,
    fieldErrors: null,
    success: false,
  });

  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<User | null> => {
      setState({
        loading: true,
        error: null,
        fieldErrors: null,
        success: false,
      });
      try {
        const response = await apiForAuthenticated.patch<User>(
          "/user/me",
          data,
        );

        // Wywołaj callback jeśli została dostarczona (np. refreshToken)
        if (onSuccess) {
          await onSuccess();
        }

        setState({
          loading: false,
          error: null,
          fieldErrors: null,
          success: true,
        });
        return response.data;
      } catch (error) {
        console.error("Error updating profile:", error);

        // Obsługa błędów z API
        if (axios.isAxiosError(error) && error.response?.data) {
          const errorData = error.response.data as {
            message?: string;
            fieldErrors?: FieldError[];
          };

          setState({
            loading: false,
            error: errorData.message || "Błąd podczas aktualizacji profilu",
            fieldErrors: errorData.fieldErrors || null,
            success: false,
          });
        } else {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Błąd podczas aktualizacji profilu";
          setState({
            loading: false,
            error: errorMessage,
            fieldErrors: null,
            success: false,
          });
        }
        return null;
      }
    },
    [onSuccess],
  );

  return {
    loading: state.loading,
    error: state.error,
    fieldErrors: state.fieldErrors,
    success: state.success,
    updateProfile,
  };
};
