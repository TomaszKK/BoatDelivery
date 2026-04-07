import { useState, useEffect } from "react";
import { api } from "@/api/api";
import type { User } from "@/types/UserType";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getAllUsers();
        setUsers(response.data || []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Nie udało się pobrać użytkowników";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
