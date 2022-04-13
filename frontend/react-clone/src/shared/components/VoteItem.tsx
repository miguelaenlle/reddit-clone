import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/outline";

const VoteItem: React.FC<{
  voteDirection: number;
  numUpvotes: number;
  handleUpvote: () => void;
  handleDownvote: () => void;
}> = (props) => {
  return (
    <div className="flex space-x-2 items-center">
      <div onClick={props.handleUpvote} className="hover:cursor-pointer">
        <ArrowUpIcon
          className={`h-4 ${
            props.voteDirection === 1 ? "text-white" : "text-zinc-400"
          } hover:text-white font-bold transition-colors`}
        />
      </div>
      <p className="text-zinc-400 hover:cursor-default transition-all">
        {props.numUpvotes}
      </p>
      <div onClick={props.handleDownvote} className="hover:cursor-pointer">
        <ArrowDownIcon
          className={`h-4 ${
            props.voteDirection === -1 ? "text-white" : "text-zinc-400"
          } hover:text-white font-bold transition-colors`}
        />
      </div>
    </div>
  );
};
export default VoteItem;
