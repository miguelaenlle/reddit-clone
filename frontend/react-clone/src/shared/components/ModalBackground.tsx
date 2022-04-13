const ModalBackground: React.FC<{ onDismiss: () => void }> = (props) => {
  return (
    <div
      onClick={props.onDismiss}
      className="z-20 fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto"
    >
      {props.children}
    </div>
  );
};
export default ModalBackground;
