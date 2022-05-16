import { CheckIcon, XIcon } from "@heroicons/react/outline";
import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import LightButton from "../../shared/components/LightButton";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { imageCSS } from "../../shared/constants/image-class";

const DeleteConfirmationButton: React.FC<{postId:  string}> = (props) => {
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
    const url = `${process.env.REACT_APP_BACKEND_URL}/posts/${props.postId}`;
    try {
       const response = await httpClient.sendRequest(url, "DELETE", {}, authContext?.token);
       console.log(response)
       // refresh the page and go back to the last page
       window.location.reload()

    } catch (error) { 

    }
  };

  if (deleteOpened) {
    if (httpClient.isLoading) {
        return (
            <div className = "flex items-center space-x-0 pl-5">
                <LoadingSpinner />
                <p className = "text-zinc-200">Deleting...</p>
            </div>
        )
    } else {
      return (
        <div className="flex items-center space-x-2 pl-5">
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
      <LightButton
        buttonImage={<XIcon className={imageCSS} />}
        buttonText="Delete"
        onClick={handleOpenDelete}
      />
    );
  }
};
export default DeleteConfirmationButton;
