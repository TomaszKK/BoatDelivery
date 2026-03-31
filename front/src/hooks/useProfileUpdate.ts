import { useState, useCallback } from "react";
import { apiForAuthenticated } from "@/api/api.config";
import type { User } from "@/types/UserType";

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface UseProfileUpdateState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useProfileUpdate = () => {
  const [state, setState] = useState<UseProfileUpdateState>({
    loading: false,
    error: null,
    success: false,
  });

  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<User | null> => {
      setState({ loading: true, error: null, success: false });
      try {
        const response = await apiForAuthenticated.patch<User>("/user/me", data);
        setState({ loading: false, error: null, success: true });
        return response.data;
      } catch (error) {
        console.error("Error updating profile:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Błąd podczas aktualizacji profilu";
        setState({ loading: false, error: errorMessage, success: false });
        return null;
      }
    },
    []
  );

  return { ...state, updateProfile };
};

