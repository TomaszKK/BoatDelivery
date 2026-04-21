import { useState, useEffect } from "react";
import { api } from "@/api/api";
import type { PaginatedResponse, UserCountByType } from "@/api/api";
import type { User } from "@/types/UserType";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [countByType, setCountByType] = useState<UserCountByType | null>(null);
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

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
      console.error("Error fetching users by type:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string = "", newPage: number = 0, newSize: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchUsers(query, newPage, newSize);
      const data = response.data as PaginatedResponse<User>;
      setUsers(data.content || []);
      setPage(data.page);
      setSize(data.size);
      setTotalCount(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się wyszukać użytkowników";
      setError(errorMessage);
      console.error("Error searching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchUsersByType = async (userType: string, query: string = "", newPage: number = 0, newSize: number = 10) => {
    setCurrentUserType(userType);
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchUsersByType(userType, query, newPage, newSize);
      const data = response.data as PaginatedResponse<User>;
      setUsers(data.content || []);
      setPage(data.page);
      setSize(data.size);
      setTotalCount(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się wyszukać użytkowników";
      setError(errorMessage);
      console.error("Error searching users by type:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersPaged = async (newPage: number = 0, newSize: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllUsersPaged(newPage, newSize);
      const data = response.data as PaginatedResponse<User>;
      setUsers(data.content || []);
      setPage(data.page);
      setSize(data.size);
      setTotalCount(data.totalElements);
      setTotalPages(data.totalPages);
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

  const fetchUsersByTypePaged = async (userType: string, newPage: number = 0, newSize: number = 10) => {
    setCurrentUserType(userType);
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUsersByTypePaged(userType, newPage, newSize);
      const data = response.data as PaginatedResponse<User>;
      setUsers(data.content || []);
      setPage(data.page);
      setSize(data.size);
      setTotalCount(data.totalElements);
      setTotalPages(data.totalPages);
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

  const fetchUserCountByType = async () => {
    try {
      const response = await api.getUserCountByType();
      setCountByType(response.data as UserCountByType);
    } catch (err: unknown) {
      console.error("Error fetching user count by type:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (isMounted) {
        fetchUserCountByType();
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      if (currentUserType) {
        await fetchUsersByTypePaged(currentUserType, page, size);
      } else {
        await fetchUsersPaged(page, size);
      }
      await fetchUserCountByType();
      return { success: true };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć użytkownika";
      console.error("Error deleting user:", err);
      return { success: false, error: errorMessage };
    }
  };

  const handlePageChange = (newPage: number) => {
    if (currentUserType) {
      fetchUsersByTypePaged(currentUserType, newPage, size);
    } else {
      fetchUsersPaged(newPage, size);
    }
  };

  const handleSizeChange = (newSize: number) => {
    if (currentUserType) {
      fetchUsersByTypePaged(currentUserType, 0, newSize);
    } else {
      fetchUsersPaged(0, newSize);
    }
  };

  return {
    users,
    loading,
    error,
    page,
    size,
    totalCount,
    totalPages,
    countByType,
    deleteUser,
    refetch: fetchUsers,
    fetchUsersPaged,
    fetchUsersByTypePaged,
    searchUsers,
    searchUsersByType,
    fetchUserCountByType,
    handlePageChange,
    handleSizeChange,
  };
};
