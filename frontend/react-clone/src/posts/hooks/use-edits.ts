import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";

export const useEditPost = (post: Post) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [editor, setEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(post.title);
  const [newDescription, setNewDescription] = useState(post.text);

  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.text);

  useEffect(() => {
    const userId = authContext?.userId;
    if (userId) {
      if (userId === post.opId) {
        setEditor(true);
      }
    }
  }, [authContext?.userId]);

  const handleStartEditMode = () => {
    setIsEditing(true);
  };

  const handleEndEditMode = () => {
    setIsEditing(false);
  };

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };
  const handleUpdateDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewDescription(e.target.value);
  };

  const handleSubmit = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/posts/${post.id}`;
    setIsLoading(true);

    try {
      const requestBody = {
        newTitle: newTitle,
        newText: newDescription,
      };
      const response = await httpClient.sendRequest(
        url,
        "PATCH",
        requestBody,
        authContext?.token
      );
      setTitle(newTitle);
      setDescription(newDescription);

      setIsEditing(false);

      console.log(response);
    } catch {}
    setIsLoading(false);
  };

  // need visual validation too pls

  return {
    editor,
    isLoading,
    isEditing,
    newTitle,
    newDescription,
    title,
    description,
    handleStartEditMode,
    handleEndEditMode,
    handleUpdateTitle,
    handleUpdateDescription,
    handleSubmit,
  };
};
