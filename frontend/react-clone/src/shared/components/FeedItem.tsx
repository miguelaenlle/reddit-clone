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
  const [voteDirection, setVoteDirection] = useState(0);
  const handleUpvote = () => {
    setVoteDirection((previousVote) => {
      if (previousVote === 1) {
        setUpvotes((previousVotes) => previousVotes - 1);
        return 0;
      } else if (previousVote === 0) {
        setUpvotes((previousVotes) => previousVotes + 1);
        return 1;
      } else if (previousVote === -1) {
        setUpvotes((previousVotes) => previousVotes + 2);
        return 1;
      } else {
        return previousVote;
      }
    });
  };
  const handleDownvote = () => {
    setVoteDirection((previousVote) => {
      if (previousVote === -1) {
        setUpvotes((previousVotes) => previousVotes + 1);
        return 0;
      } else if (previousVote === 0) {
        setUpvotes((previousVotes) => previousVotes - 1);
        return -1;
      } else if (previousVote === 1) {
        setUpvotes((previousVotes) => previousVotes - 2);
        return -1;
      } else {
        return previousVote;
      }
    });
  };
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
            <div onClick={handleUpvote} className="hover:cursor-pointer">
              <ArrowUpIcon
                className={`h-4 ${
                  voteDirection === 1 ? "text-white" : "text-zinc-400"
                } hover:text-white font-bold transition-colors`}
              />
            </div>
            <p className="text-zinc-400 hover:cursor-default transition-all">{upvotes}</p>
            <div onClick={handleDownvote} className="hover:cursor-pointer">
              <ArrowDownIcon
                className={`h-4 ${
                  voteDirection === -1 ? "text-white" : "text-zinc-400"
                } hover:text-white font-bold transition-colors`}
              />
            </div>
          </div>
          <div className="flex-grow"></div>
          <p className="text-zinc-400">{props.numComments} comments</p>
        </div>
      </div>
    </div>
  );
};
export default FeedItem;
