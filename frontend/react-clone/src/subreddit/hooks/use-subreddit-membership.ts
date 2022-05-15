import { useCallback, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";

export const useSubredditMembership = () => {
  const httpClient = useHttpClient();
  const authContext = useContext(AuthContext);
  const [subreddits, setSubreddits] = useState<string[]>([]);
  const [subredditIsLoading, setSubredditIsLoading] = useState(false);
  useEffect(() => {
    initializeMemberships();
  }, [authContext?.userId]);
  const initializeMemberships = async () => {
    // get the user id
    if (authContext?.userId) {
      setSubredditIsLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/${authContext?.userId}`;
      const response = await httpClient.sendRequest(url, "GET");
      const data = response.data;
      if (data) {
        setSubreddits(data.subreddits);
      }
      setSubredditIsLoading(false);
    }
  };
  const checkMembershipStatus = (subId: string) => {
    if (subreddits.includes(subId)) {
      return true;
    } else {
      return false;
    }
  };

  const changeSubredditMembership = useCallback(
    async (subredditId: string, isJoin: boolean) => {
      setSubredditIsLoading(true);

      const url = `${
        process.env.REACT_APP_BACKEND_URL
      }/subreddits/${subredditId}/${isJoin ? "join" : "leave"}`;
      try {
        const response = await httpClient.sendRequest(
          url,
          "POST",
          {},
          authContext?.token
        );
        if (isJoin) {
          setSubreddits((prevSubreddits) => [...prevSubreddits, subredditId]);
        } else {
          setSubreddits((prevSubreddits) =>
            prevSubreddits.filter((sub) => sub !== subredditId)
          );
        }
        setSubredditIsLoading(false);
      } catch (error) {
        setSubredditIsLoading(false);
      }
    },
    [subreddits]
  );
  const joinSubreddit = useCallback(
    async (subId: string) => {
      await changeSubredditMembership(subId, true);
    },
    [subreddits]
  );
  const leaveSubreddit = useCallback(
    async (subId: string) => {
      await changeSubredditMembership(subId, false);
    },
    [subreddits]
  );
  return {
    subredditIsLoading,
    subreddits,
    initializeMemberships,
    checkMembershipStatus,
    joinSubreddit,
    leaveSubreddit,
  };
};
