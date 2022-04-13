import { useEffect, useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/outline";
import VoteItem from "./VoteItem";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const FeedItem: React.FC<{
  postId: string;
  title: string;
  subName: string;
  opName: string;
  initialUpvotes: number;
  numComments: number;
  date: Date | null;
}> = (props) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(props.initialUpvotes);
  const [timeAgo, setTimeAgo] = useState<string | null>(null);
  const [voteDirection, setVoteDirection] = useState(0);

  const updateTimeAgo = () => {
    try {
      if (props.date) {
        setTimeAgo(moment(props.date).fromNow());
      }
    } catch {}
  };

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

  useEffect(() => {
    updateTimeAgo();
  }, []);

  const openPost = () => {
    navigate(`/post/${props.postId}`);
  };

  return (
    <div className="w-1/3 p-1.5">
      <div className="hover:cursor-pointer group bg-zinc-800 border border-zinc-700 p-3 hover:border-zinc-400 max-h-fit transition-colors">
        <h1
          onClick={openPost}
          className="text-2xl text-white group-hover:underline"
        >
          {props.title}
        </h1>
        <p className="text-l text-zinc-400 py-2">
          <span className="hover:underline text-white">r/{props.subName}</span>
          {" • "}
          <span className="hover:underline">u/{props.opName}</span>
          {" • "}
          {timeAgo && <span>{timeAgo}</span>}
        </p>
        <div className="flex">
          <VoteItem
            voteDirection={voteDirection}
            handleUpvote={handleUpvote}
            handleDownvote={handleDownvote}
            numUpvotes={upvotes}
          />
          <div className="flex-grow"></div>
          <p className="text-zinc-400">{props.numComments} comments</p>
        </div>
      </div>
    </div>
  );
};
export default FeedItem;
