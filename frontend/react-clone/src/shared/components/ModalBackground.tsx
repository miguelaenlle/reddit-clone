import {
  CheckIcon,
  ExclamationIcon,
  LogoutIcon,
  XIcon,
} from "@heroicons/react/outline";
import React from "react";
import { imageCSS } from "../constants/image-class";
import LightButton from "./LightButton";

const ModalBackground: React.FC<{
  onDismiss: () => void;
  handleEndConfirm?: () => void;
  handleDismiss?: () => void;
  confirmingLeave?: boolean;
}> = (props) => {
  // only close the modal if the user clicks outside of the modal
  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      props.onDismiss();
    }
  };

  return (
    <div
      onClick={handleClickOutside}
      className="animate-fade z-20 fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 overflow-y-auto"
    >
      {props.confirmingLeave ? (
        <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
          <h1 className="text-2xl text-white">Are you sure you're leaving?</h1>
          <p className="text-lg text-zinc-400">
            Your unsaved changes will be lost if you leave this page.
          </p>
          <div className="flex mt-2 space-x-2">
            <LightButton
              onClick={props.handleEndConfirm}
              buttonText="Leave Anyway"
              buttonImage={<ExclamationIcon className={imageCSS} />}
            />
            <LightButton
              onClick={props.handleDismiss}
              buttonText="Go Back"
              buttonImage={<CheckIcon className={imageCSS} />}
            />
          </div>
        </div>
      ) : (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    </div>
  );
};
export default ModalBackground;
