const ImageCounter: React.FC<{light: boolean; imageNumber: number; totalImages: number}> = (props) => {
  return (
    <div className="m-2 px-5 py-2 bg-zinc-700 bg-opacity-50 rounded-lg w-fit">
      <p className = {props.light ? "text-zinc-50" : ""}>
        {props.imageNumber}/{props.totalImages}
      </p>
    </div>
  );
};
export default ImageCounter;
