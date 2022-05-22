import { useState } from "react";
import ReactDOM from "react-dom";
import { useHistory, useLocation } from "react-router-dom";
import ModalBackground from "./ModalBackground";

const Modal: React.FC<{ confirmLeave?: boolean }> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const modalObject = document.getElementById("modal");

  const state: any = location.state;
  const background = state && state.background;

  const [confirmingLeave, setConfirmingLeave] = useState(false);

  const handleStartConfirm = () => {
    setConfirmingLeave(true);
  };

  const handleEndConfirm = () => {
    history.push({
      pathname: background.pathname,
    });
    setConfirmingLeave(false);
  };

  const handleDismiss = () => {
    setConfirmingLeave(false);
  };

  const onDismiss = () => {
    if (!props.confirmLeave) {
      history.push({
        pathname: background.pathname,
      });
    } else {
      handleStartConfirm();
    }
  };

  if (modalObject) {
    return ReactDOM.createPortal(
      <ModalBackground
        onDismiss={onDismiss}
        handleDismiss={handleDismiss}
        handleEndConfirm={handleEndConfirm}
        confirmingLeave={confirmingLeave}
      >
        {props.children}
      </ModalBackground>,
      modalObject
    );
  } else {
    return <div></div>;
  }
};
export default Modal;
