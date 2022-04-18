import { useEffect, useState } from "react";
import { Post } from "../models/Post";
import { useHttpClient } from "./http-hook";

export const usePostsClient = (
  initialQuery: string | undefined,
  initialUserId: string | undefined,
  initialSubId: string | undefined,
  resultsPerPage: number
) => {
  const [query, setQuery] = useState(initialQuery);
  const [userId, setUserId] = useState(initialUserId);
  const [subId, setSubId] = useState(initialSubId);

  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("top");

  const httpClient = useHttpClient();

  const resetData = () => {
    setPage(0);
    setPosts([]);
  };

  const updateQuery = (newQuery: string) => {
    setSelectedOption("top");
    setQuery(newQuery);
  };

  const updateUserId = (newUserId: string) => {
    setSelectedOption("top");
    setUserId(newUserId);
  };

  const updateSubId = (newSubId: string) => {
    setSelectedOption("top");
    setSubId(newSubId);
  };

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    resetData();
    initializePosts();
  }, [query, subId, userId, selectedOption]);

  const fetchPosts = async (
    pageNumber: number,
    selectedOption: string
  ): Promise<Post[] | null> => {
    const formattedPosts: Post[] | null = await httpClient.fetchPosts(
      pageNumber,
      selectedOption,
      resultsPerPage,
      userId,
      subId,
      query
    );
    return formattedPosts;
  };

  const initializePosts = async () => {
    const posts = await fetchPosts(0, selectedOption);
    if (posts) {
      setPosts(posts);
    }
  };

  const expandResults = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    try {
      const additionalSearchResults = await fetchPosts(newPage, selectedOption);
      if (additionalSearchResults) {
        setPosts((prevResults) => [...prevResults, ...additionalSearchResults]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangedOption = async (newOption: string) => {
    const posts = await fetchPosts(page, newOption);
    if (posts) {
      setPosts(posts);
    }
  };

  const httpIsLoading = httpClient.isLoading;

  return {
    httpIsLoading,
    isLoading,
    selectedOption,
    page,
    posts,
    handleSelectedOption,
    initializePosts,
    expandResults,
    handleChangedOption,
    updateQuery,
    updateUserId,
    updateSubId,
  };
};
