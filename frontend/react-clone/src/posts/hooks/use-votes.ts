import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

export const useVotes = (
  postId: string,
  numVotes: number,
  isPost: boolean,
  handleOpenSignup: () => void
) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [upvotes, setUpvotes] = useState(numVotes);
  const [voteDirection, setVoteDirection] = useState(0);

  const initializeData = async () => {
    setIsLoading(true);

    try {
      // get the user's vote direction
      const url = `${process.env.REACT_APP_BACKEND_URL}/${
        isPost ? "posts" : "comments"
      }/${postId}/vote-direction`;
      const responseData = await httpClient.sendRequest(
        url,
        "GET",
        undefined,
        authContext?.token
      );
      const voteDirection = responseData.voteDirection;
      setVoteDirection(voteDirection);
    } catch (error) {}

    setIsLoading(false);
  };

  useEffect(() => {
    initializeData();
  }, []);

  const handleVote = async (newDirection: number) => {
    try {
      if (authContext?.token) {
        const url = `${process.env.REACT_APP_BACKEND_URL}/${
          isPost ? "posts" : "comments"
        }/${postId}/vote`;
        const responseData = await httpClient.sendRequest(
          url,
          "PATCH",
          { voteDirection: newDirection },
          authContext?.token
        );
      } else {
        handleOpenSignup();
      }
    } catch (error) {}
  };

  const handleUpvote = async () => {
    setIsLoading(true);
    // update vote on backend
    await handleVote(1);

    // update vote on frontend
    if (authContext?.token) {
      setVoteDirection((previousVote) => {
        if (previousVote === 1) {
          setUpvotes((previousVotes) => previousVotes - 1);
          return 0;
        } else if (previousVote === 0) {
          setUpvotes((previousVotes) => previousVotes + 1);
          return 1;
        } else if (previousVote === -1) {
          setUpvotes((previousVotes) => previousVotes + 2);
          return 1;
        } else {
          return previousVote;
        }
      });
    }
    setIsLoading(false);
  };
  const handleDownvote = async () => {
    setIsLoading(true);
    // update vote on backend
    await handleVote(-1);

    // update vote on frontend
    if (authContext?.token) {
      setVoteDirection((previousVote) => {
        if (previousVote === -1) {
          setUpvotes((previousVotes) => previousVotes + 1);
          return 0;
        } else if (previousVote === 0) {
          setUpvotes((previousVotes) => previousVotes - 1);
          return -1;
        } else if (previousVote === 1) {
          setUpvotes((previousVotes) => previousVotes - 2);
          return -1;
        } else {
          return previousVote;
        }
      });
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    upvotes,
    voteDirection,
    handleUpvote,
    handleDownvote,
  };
};
