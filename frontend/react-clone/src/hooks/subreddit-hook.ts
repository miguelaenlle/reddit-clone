import { useEffect, useState } from "react";
import { Subreddit } from "../models/Subreddit";
import { useHttpClient } from "./http-hook";

export const useSubredditsClient = (
  initialQuery: string | undefined,
  resultsPerPage: number
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  const [page, setPage] = useState(0);
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  const httpClient = useHttpClient();

  const resetData = () => {
    setPage(0);
    setSubreddits([]);
  };

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  useEffect(() => {
    resetData();
    initializeSubreddits();
  }, [query]);

  const fetchSubreddits = async (pageNumber: number) => {
    if (query) {
      const searchResultsFormatted = await httpClient.fetchSubreddits(
        query,
        pageNumber,
        resultsPerPage
      );
      return searchResultsFormatted;
    } else {
      return null;
    }
  };

  const initializeSubreddits = async () => {
    try {
      const searchResults = await fetchSubreddits(0);
      if (searchResults) {
        setSubreddits(searchResults);
      }
    } catch (error) {}
  };

  const expandSubreddits = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    try {
      const additionalSearchResults = await fetchSubreddits(newPage);
      setSubreddits((prevSubreddits) => [
        ...prevSubreddits,
        ...additionalSearchResults,
      ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const httpIsLoading = httpClient.isLoading;

  return {
    httpIsLoading,
    isLoading,
    page,
    subreddits,
    fetchSubreddits,
    initializeSubreddits,
    expandSubreddits,
    updateQuery
  };
};
