import { useState, useCallback, useRef, useEffect } from "react";
import { Post } from "../models/Post";
import { Subreddit } from "../models/Subreddit";
import { User } from "../models/User";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeHttpRequests = useRef<any[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method: string,
      body?: { [key: string]: any },
      authToken?: string
    ) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method,
          headers: authToken ? headers : undefined,
          body: body ? JSON.stringify(body) : undefined,
          signal: httpAbortController.signal,
        });
        const responseData = await response.json();
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const fetchUserSubreddits = useCallback(
    async (userId: string): Promise<Subreddit[] | null> => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/subreddits`;
        const responseData = await sendRequest(url, "GET");
        const subreddits = responseData.sub_ids;
        const formattedSubreddits = subreddits.map(
          (subredditData: { [key: string]: any }) => {
            return new Subreddit(
              subredditData.name,
              subredditData._id,
              subredditData.num_members,
              subredditData.description
            );
          }
        );
        return formattedSubreddits;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const fetchPosts = useCallback(
    async (
      pageNumber: number,
      selectedOption: string,
      resultsPerPage: number,
      userId?: string | null,
      subId?: string | null,
      query?: string | null
    ): Promise<Post[] | null> => {
      try {
        const url = `${
          process.env.REACT_APP_BACKEND_URL
        }/posts?page=${pageNumber}&numResults=${resultsPerPage}&sortMode=${selectedOption}${
          subId ? `&subId=${subId}` : ""
        }${query ? `&query=${query}` : ""}${userId ? `&userId=${userId}` : ""}`;
        console.log(url);
        const response = await sendRequest(url, "GET");
        const rawPosts = response.posts;
        const formattedPosts = rawPosts.map((post: { [key: string]: any }) => {
          return new Post(
            post.id,
            post.title,
            post.text,
            post.sub_id.name, // add sub id
            post.sub_id._id,
            post.user_id.username, // add OP name
            post.user_id._id,
            post.post_time,
            post.num_upvotes,
            post.num_comments
          );
        });
        return formattedPosts;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const fetchSubreddits = useCallback(
    async (query: string | null, pageNumber: number, numResults: number) => {
      try {
        const url = `${
          process.env.REACT_APP_BACKEND_URL
        }/subreddits?page=${pageNumber}&numResults=${numResults}${
          query ? `&query=${query}` : ""
        }`;
        const searchResults = await sendRequest(url, "GET");
        const searchResultsFormatted = searchResults.results.map(
          (result: { [key: string]: any }) => {
            return new Subreddit(
              result.name,
              result.id,
              result.num_members,
              result.description
            );
          }
        );
        return searchResultsFormatted;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const fetchUsers = useCallback(
    async (query: string | null, pageNumber: number, numResults: number) => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/users?${
          query ? `searchQuery=${query}` : ""
        }&page=${pageNumber}&numResults=${numResults}`;
        const searchResults = await sendRequest(url, "GET");
        const searchResultsFormatted = searchResults.data.map(
          (result: { [key: string]: any }) => {
            return new User(result.id, result.username, result.num_upvotes);
          }
        );
        return searchResultsFormatted;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const fetchUser = useCallback(async (userId: string) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`;
      const user = await sendRequest(url, "GET");
      return user;
    } catch (error) {
      return null;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortController) => {
        abortController.abort();
      });
    };
  }, [activeHttpRequests.current]);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
    fetchPosts,
    fetchSubreddits,
    fetchUserSubreddits,
    fetchUsers,
    fetchUser,
  };
};
