import { useCallback, useEffect, useState } from "react";
import { Post } from "../models/Post";
import { useHttpClient } from "./http-hook";

export const usePostsClient = (
  search: boolean,
  initialQuery: string | undefined,
  initialUserId: string | undefined,
  initialSubId: string | undefined,
  resultsPerPage: number
) => {
  const [atBottom, setAtBottom] = useState(false);
  const [hitLimit, setHitLimit] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [userId, setUserId] = useState(initialUserId);
  const [subId, setSubId] = useState(initialSubId);

  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("top");

  const httpClient = useHttpClient();

  const handleHitBottom = () => {
    setAtBottom(true);
  };

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
    if (search && !query) {
      return null;
    }
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

  const expandResults = useCallback(async () => {
    console.log("Expand results");
    setIsLoading(true);

    const newPage = page + 1;
    console.log(newPage);

    setPage(newPage);
    try {
      //
      const additionalSearchResults = await fetchPosts(newPage, selectedOption);
      if (additionalSearchResults) {
        if (additionalSearchResults.length === 0) {
          setHitLimit(true);
        }
        setPosts((prevResults) => {
          const newResults = [...prevResults, ...additionalSearchResults];
          return newResults;
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setAtBottom(false);
  }, [query, page, selectedOption, posts, isLoading]);

  const handleChangedOption = async (newOption: string) => {
    const posts = await fetchPosts(page, newOption);
    if (posts) {
      setPosts(posts);
    }
  };

  const httpIsLoading = httpClient.isLoading;

  return {
    hitLimit,
    atBottom,
    query,
    httpIsLoading,
    isLoading,
    selectedOption,
    page,
    posts,
    handleSelectedOption,
    initializePosts,
    expandResults,
    handleChangedOption,
    handleHitBottom,
    updateQuery,
    updateUserId,
    updateSubId,
  };
};
