import { useState, useCallback, useRef, useEffect } from "react";
import { Post } from "../models/Post";
import { Subreddit } from "../models/Subreddit";
import { User } from "../models/User";
import axios from "axios";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeHttpRequests = useRef<any[]>([]);

  const sendFormDataRequest = useCallback(
    async (
      url: string,
      method: string,
      formData: FormData,
      authToken?: string | null
    ) => {
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      try {
        setIsLoading(true);
        let headers: {
          [key: string]: string;
        } = {
          "content-type": "multipart/form-data",
        };
        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
        }
        const config = {
          headers,
        };
        if (method === "POST") {
          const response = await axios.post(url, formData, config);
          console.log("Response", response);
          activeHttpRequests.current = activeHttpRequests.current.filter(
            (reqCtrl) => reqCtrl !== httpAbortController
          );
          setIsLoading(false);
          return {
            error: response.statusText,
            data: response.data,
            message: response.data.message,
          };
        } else if (method === "PATCH") {
          const response = await axios.patch(url, formData, config);
          
          activeHttpRequests.current = activeHttpRequests.current.filter(
            (reqCtrl) => reqCtrl !== httpAbortController
          );
          setIsLoading(false);
          return {
            error: response.statusText,
            data: response.data,
            message: response.data.message,
          };
        } else {
          return {
            error: "Method not supported",
            data: null,
            message: null,
          };
        }
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const sendRequest = useCallback(
    async (
      url: string,
      method: string,
      body?: { [key: string]: any },
      authToken?: string | null
    ) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      let headers: { [key: string]: string } = {};
      headers["Content-Type"] = "application/json";
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method,
          headers: headers,
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
              subredditData.sub_owner,
              subredditData.num_members,
              subredditData.description,
              subredditData.background_image_url,
              subredditData.picture_url
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
            post.num_comments,
            post.deleted,
            post.image_ids
          );
        });
        return formattedPosts;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const fetchAllSubreddits = useCallback(
    async (pageNumber: number, numResults: number) => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/all?page=${pageNumber}&numResults=${numResults}`;
        const allResults = await sendRequest(url, "GET");

        const allResultsFormatted = allResults.results.map(
          (result: { [key: string]: any }) => {
            return new Subreddit(
              result.name,
              result.id,
              result.sub_owner,
              result.num_members,
              result.description,
              result.background_image_url,
              result.picture_url
            );
          }
        );

        return allResultsFormatted;
      } catch (error) {}
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
              result.sub_owner,
              result.num_members,
              result.description,
              result.background_image_url,
              result.picture_url
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
    sendFormDataRequest,
    clearError,
    fetchPosts,
    fetchSubreddits,
    fetchAllSubreddits,
    fetchUserSubreddits,
    fetchUsers,
    fetchUser,
  };
};
