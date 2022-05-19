import ReactDOM from "react-dom";
import { useHistory, useLocation } from "react-router-dom";
import ModalBackground from "./ModalBackground";

const Modal: React.FC = (props) => {
  const history = useHistory();
  const location = useLocation();
  const modalObject = document.getElementById("modal");

  const state: any = location.state;
  const background = state && state.background;

  const onDismiss = () => {
    history.push({
      pathname: background.pathname,
    });
  };
  
  if (modalObject) {
    return ReactDOM.createPortal(
      <ModalBackground onDismiss={onDismiss}>{props.children}</ModalBackground>,
      modalObject
    );
  } else {
    return <div></div>;
  }
};
export default Modal;
