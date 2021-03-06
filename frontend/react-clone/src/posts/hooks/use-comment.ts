import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

export const useComments = (
  parentIsPost: boolean,
  parentId: string,
  addComment: (comment: { [key: string]: any }) => void
) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | undefined>();
  const history = useHistory();
  const location = useLocation();
  const state: any = location.state;
  const background = state && state.background;

  const handleReply = () => {
    if (authContext?.token) {
      setReplying(true);
    } else {
      history.push({
        pathname: "/signup",
        state: {
          background: background,
        },
      });
    }
  };
  const handleCloseReply = () => {
    setReplying(false);
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value);
  };

  useEffect(() => {
    setError(undefined);
  }, []);

  const checkReplyValidity = () => {
    if (reply.length === 0) {
      return "Reply cannot be empty";
    } else if (reply.length > 400) {
      return "Reply cannot be longer than 400 characters";
    } else {
      return undefined;
    }
  };

  const handleSubmitCommentToPost = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/comments/`;
    let body = {};
    if (parentIsPost) {
      body = {
        parentPostId: parentId,
        parentIsPost: parentIsPost,
        text: reply,
      };
    } else {
      body = {
        parentCommentId: parentId,
        parentIsPost: parentIsPost,
        text: reply,
      };
    }

    const error = checkReplyValidity();
    if (error) {
      setError(error);
      return;
    }

    try {
      setIsLoading(true);
      const responseData = await httpClient.sendRequest(
        url,
        "POST",
        body,
        authContext?.token
      );
      const comment = responseData.comment;
      const commentWithUser = {
        ...comment,
        user_id: {
          _id: comment.user_id,
          username: authContext?.username ?? "",
        },
      };

      addComment(commentWithUser);
      setIsLoading(false);
      setReplying(false);
      setReply("");
    } catch {}
  };

  return {
    error,
    isLoading,
    replying,
    reply,
    handleReply,
    handleCloseReply,
    handleReplyChange,
    handleSubmitCommentToPost,
  };
};
