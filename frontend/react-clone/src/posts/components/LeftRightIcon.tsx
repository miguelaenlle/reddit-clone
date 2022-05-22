import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

const LeftRightIcon: React.FC<{
  light: boolean;
  left: boolean;
  handleClick: () => void;
}> = (props) => {
  return (
    <div
      onClick={() => {
        props.handleClick();
      }}
      className=" bg-zinc-700 p-1 bg-opacity-50 hover:bg-opacity-100 hover:cursor-pointer rounded-lg"
    >
      {props.left ? (
        <ChevronLeftIcon
          className={`h-5 ${props.light ? "text-zinc-50" : ""}`}
        />
      ) : (
        <ChevronRightIcon
          className={`h-5  ${props.light ? "text-zinc-50" : ""}`}
        />
      )}
    </div>
  );
};
export default LeftRightIcon;
