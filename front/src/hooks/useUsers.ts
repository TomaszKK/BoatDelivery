import { useState, useEffect } from "react";
import { api } from "@/api/api";
import type { User } from "@/types/UserType";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getAllUsers();
        if (isMounted) {
          setUsers(response.data || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Nie udało się pobrać użytkowników";
          setError(errorMessage);
          console.error("Error fetching users:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { users, loading, error };
};

