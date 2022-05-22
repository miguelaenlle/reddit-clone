import { XIcon } from "@heroicons/react/outline";

const XMarkButton: React.FC<{ handleClick: () => void }> = (props) => {
  return (
    <div
      onClick={() => {
        props.handleClick();
      }}
      className={`flex items-center space-x-1 bg-zinc-700 bg-opacity-50 hover:bg-opacity-100 rounded-lg p-1`}
    >
      <XIcon className="h-5 group-hover:text-zinc-200" />
    </div>
  );
};
export default XMarkButton;
