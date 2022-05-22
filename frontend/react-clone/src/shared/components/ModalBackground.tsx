const ModalBackground: React.FC<{ onDismiss: () => void }> = (props) => {
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
      {props.children}
    </div>
  );
};
export default ModalBackground;
