import { prependOnceListener } from "process";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

export const useComments = (
  postId: string,
  addComment: (comment: { [key: string]: any }) => void
) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleReply = () => {
    setReplying(true);
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
    const body = {
      parentPostId: postId,
      parentIsPost: true,
      text: reply,
    };

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
      console.log(responseData);
      addComment(responseData.comment);
      setIsLoading(false);
      setReplying(false);
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
