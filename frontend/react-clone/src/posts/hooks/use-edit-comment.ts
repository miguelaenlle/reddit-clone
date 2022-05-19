import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
export const useEditComment = (comment: { [key: string]: any }) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = authContext?.userId;
    if (userId) {
      const commentUserId = comment?.user_id?._id;
      if (userId === commentUserId) {
        // check if the user is allowed to edit
        setCanEdit(true);
      }
    }
  }, [authContext?.userId]);

  useEffect(() => {
    setError(undefined);
  }, [editing, newComment, commentText]);

  useEffect(() => {
    if (editing) {
      setNewComment(commentText);
    }
  }, [editing]);

  useEffect(() => {
    try {
      setCommentText(comment?.comment_content);
      setNewComment(comment?.comment_content);
    } catch (e) {
    }
  }, []);

  const handleNewComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleOpenEditor = () => {
    setEditing(true);
  };

  const handleCloseEditor = () => {
    setEditing(false);
  };

  const checkEditValidity = () => {
    if (newComment.length === 0) {
      return "Comment cannot be empty";
    } else if (newComment.length > 400) {
      return "Comment cannot be longer than 400 characters";
    } else {
      return undefined;
    }
  };

  const handleSubmitEdit = async () => {
    setIsLoading(true);
    const error = checkEditValidity();
    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    } else {
      setError(undefined);
    }

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/comments/${comment._id}`;
      const response = await httpClient.sendRequest(
        url,
        "PATCH",
        {
          newCommentContent: newComment,
        },
        authContext?.token
      );
      setCommentText(newComment);
      setEditing(false);
    } catch {
      setError("An error occured. Please try again.");
    }

    setIsLoading(false);
  };

  return {
    error,
    loading,
    canEdit,
    editing,
    newComment,
    commentText,
    handleNewComment,
    handleOpenEditor,
    handleCloseEditor,
    handleSubmitEdit,
  };
};
