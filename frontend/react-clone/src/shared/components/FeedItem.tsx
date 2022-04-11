import { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/outline";

const FeedItem: React.FC<{
  title: string;
  subName: string;
  opName: string;
  initialUpvotes: number;
  numComments: number;
}> = (props) => {
  const [upvotes, setUpvotes] = useState(props.initialUpvotes);
  const handleVote = () => {};
  return (
    <div className="w-1/3 p-1.5">
      <div className="bg-zinc-800 border border-zinc-700 p-3 max-h-fit">
        <h1 className="text-2xl text-white">{props.title}</h1>
        <p className="text-l text-white py-2">
          r/{props.subName}{" "}
          <span className="text-zinc-400">• u/{props.opName}</span>
        </p>
        <div className="flex">
          <div className="flex space-x-2 items-center">
            <ArrowUpIcon className="h-4 text-white font-bold" />
            <p className="text-zinc-400">{upvotes}</p>
            <ArrowDownIcon className="h-4 text-zinc-400 font-bold" />
          </div>
          <div className = "flex-grow"></div>
          <p className = "text-zinc-400">{props.numComments} comments</p>
        </div>
      </div>
    </div>
  );
};
export default FeedItem;
