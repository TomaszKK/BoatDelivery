import { useEffect, useState, useCallback } from "react";
import { apiForAuthenticated } from "@/api/api.config";
import type { UserType } from "@/types/UserType";

export interface UserResponse {
  id: string;
  keycloakId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  userType: UserType;
  createdAt?: string;
  updatedAt?: string;
}

interface UseProfileState {
  user: UserResponse | null;
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
      const response = await apiForAuthenticated.get<UserResponse>("/user/me");
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
    let isMounted = true;

    fetchProfile()
      .then(() => {
        if (!isMounted) return;
      })
      .catch((error) => {
        console.error("Error in fetchProfile:", error);
        if (isMounted) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Błąd podczas pobierania profilu";
          setState({ user: null, loading: false, error: errorMessage });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...state, refetch: fetchProfile };
};
