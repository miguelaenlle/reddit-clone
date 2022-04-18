import { useState, useEffect } from "react";
import { User } from "../models/User";

import { useHttpClient } from "./http-hook";

export const useUsersClient = (
  initialQuery: string | undefined,
  numResultsPerPage: number
) => {
  const [query, setQuery] = useState(initialQuery);

  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const httpClient = useHttpClient();
  const httpIsLoading = httpClient.isLoading;

  const resetData = () => {
    setPage(0);
    setUsers([]);
  };

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  useEffect(() => {
    resetData();
    initializeUsers();
  }, [query]);

  const fetchUsers = async (pageNumber: number): Promise<User[] | null> => {
    if (query) {
      const formattedUsers: User[] | null = await httpClient.fetchUsers(
        query,
        pageNumber,
        numResultsPerPage
      );
      return formattedUsers;
    } else {
      return null;
    }
  };

  const initializeUsers = async () => {
    try {
      const users = await fetchUsers(0);
      if (users) {
        setUsers(users);
      }
    } catch (error) {}
  };

  const expandResults = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    try {
      const additionalSearchResults = await fetchUsers(newPage);
      if (additionalSearchResults) {
        setUsers((prevUsers) => [...prevUsers, ...additionalSearchResults]);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  return {
    query,
    page,
    users,
    isLoading,
    httpIsLoading,
    updateQuery,
    initializeUsers,
    expandResults,
  };
};
