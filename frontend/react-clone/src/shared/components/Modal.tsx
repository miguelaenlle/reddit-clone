import ReactDOM from "react-dom"
import ModalBackground from "./ModalBackground";

const Modal: React.FC<{ onDismiss: () => void }> = (props) => {
    
  const modalObject = document.getElementById("modal");

  if (modalObject) {
    return ReactDOM.createPortal(
        <ModalBackground onDismiss = {props.onDismiss}>
            {props.children}
        </ModalBackground>,
        modalObject
    )
  } else {
      return <div>

      </div>
  }
}
export default Modal