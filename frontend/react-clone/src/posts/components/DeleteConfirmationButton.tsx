import { CheckIcon, XIcon } from "@heroicons/react/outline";
import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import LightButton from "../../shared/components/LightButton";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { imageCSS } from "../../shared/constants/image-class";

const DeleteConfirmationButton: React.FC<{
  itemId: string;
  isPost: boolean;
  deleteComment?: (commentId: string) => void;
}> = (props) => {
  const httpClient = useHttpClient();
  const location: any = useLocation();
  const authContext = useContext(AuthContext);
  const [deleteOpened, setDeleteOpened] = useState(false);

  const handleOpenDelete = () => {
    setDeleteOpened(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpened(false);
  };

  const handleClick = async () => {
    let url = "";
    if (props.isPost) {
      url = `${process.env.REACT_APP_BACKEND_URL}/posts/${props.itemId}`;
    } else {
      url = `${process.env.REACT_APP_BACKEND_URL}/comments/${props.itemId}`;
    }
    try {
      const response = await httpClient.sendRequest(
        url,
        "DELETE",
        {},
        authContext?.token
      );
      // refresh the page and go back to the last page
      if (props.isPost) {
        window.location.reload();
      } else {
        if (props.deleteComment) {
          props.deleteComment(props.itemId);
        }
      }
    } catch (error) {}
  };

  if (deleteOpened) {
    if (httpClient.isLoading) {
      return (
        <div
          className={`flex items-center space-x-0  ${
            props.isPost ? "pl-5" : ""
          }`}
        >
          <LoadingSpinner />
          <p className="text-zinc-200">Deleting...</p>
        </div>
      );
    } else {
      return (
        <div
          className={`flex items-center space-x-2 ${
            props.isPost ? "pl-5" : ""
          }`}
        >
          <p className="text-zinc-200 pr-2">Are you sure?</p>
          <LightButton
            buttonImage={<CheckIcon className={imageCSS} />}
            buttonText="Yes"
            onClick={handleClick}
          />
          <LightButton
            buttonImage={<XIcon className={imageCSS} />}
            buttonText="Cancel"
            onClick={handleCloseDelete}
          />
        </div>
      );
    }
  } else {
    return (
      <React.Fragment>
        {!props.isPost ? (
          <ButtonNoBorder
            buttonImage={<XIcon className={imageCSS} />}
            buttonText={"Delete"}
            handleClick={handleOpenDelete}
          />
        ) : (
          <LightButton
            buttonImage={<XIcon className={imageCSS} />}
            buttonText="Delete"
            onClick={handleOpenDelete}
          />
        )}
      </React.Fragment>
    );
  }
};
export default DeleteConfirmationButton;
