import { useContext, useEffect, useState } from "react";
import { NodeBuilderFlags } from "typescript";
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
  const [error, setError] = useState<string | undefined>();

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
    setError(undefined);
    setNewTitle(e.target.value);
  };
  const handleUpdateDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setError(undefined);
    setNewDescription(e.target.value);
  };

  const validateInputs = () => {
    if (newTitle.length === 0 || newDescription.length > 40) {
      return false;
    } else if (description.length > 300) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async () => {
    setError(undefined);
    const inputsValid = validateInputs();
    if (!inputsValid) {
      setError("Title must be 1-40 characters & description must be 0-300");
      return;
    }

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

    } catch {
      setError("An error occured, please try again.");
    }
    setIsLoading(false);
  };

  // need visual validation too pls

  return {
    error,
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
