import { useEffect, useState, useCallback } from "react";
import { apiForAuthenticated } from "@/api/api.config";
import type { User } from "@/types/UserType";

interface UseProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useProfile = () => {
  const [state, setState] = useState<UseProfileState>({
    user: null,
    loading: false,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    setState({ user: null, loading: true, error: null });
    try {
      const response = await apiForAuthenticated.get<User>("/user/me");
      setState({ user: response.data, loading: false, error: null });
    } catch (error) {
      console.error("Error fetching profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Błąd podczas pobierania profilu";
      setState({ user: null, loading: false, error: errorMessage });
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { ...state, refetch: fetchProfile };
};
