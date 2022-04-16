import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import VoteItem from "./VoteItem";
import { Post } from "../../models/Post";

const FeedItem: React.FC<{
  post: Post;
}> = (props) => {
  const history = useHistory();
  const [upvotes, setUpvotes] = useState(props.post.initialUpvotes);
  const [timeAgo, setTimeAgo] = useState<string | null>(null);
  const [voteDirection, setVoteDirection] = useState(0);

  const updateTimeAgo = () => {
    try {
      if (props.post.postDate) {
        setTimeAgo(moment(props.post.postDate).fromNow());
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
  const feedItemDivRef = useRef<HTMLDivElement | null>(null);

  const openPost = (e: React.MouseEvent<HTMLDivElement>) => {
    history.push(`/home/post/${props.post.id}`);
  };
  const openSubreddit = () => {
    history.push(`/sub/${props.post.subId}`); // fix
  };
  const openUser = () => {
    history.push(`/user/${props.post.opId}`); // fix
  };

  return (
    <div className="w-1/3 p-1.5">
      <div
        ref={feedItemDivRef}
        className="z-10 hover:cursor-pointer group bg-zinc-800 border border-zinc-700 p-3 hover:border-zinc-400 max-h-fit transition-colors"
      >
        <h1
          onClick={openPost}
          className="text-2xl text-white group-hover:underline"
        >
          {props.post.title}
        </h1>
        <p className="z-50 text-l text-zinc-400 py-2">
          <span onClick={openSubreddit} className="hover:underline text-white">
            r/{props.post.subName}
          </span>
          {" • "}
          <span onClick={openUser} className="hover:underline">
            u/{props.post.opName}
          </span>
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
          <p className="text-zinc-400">{props.post.numComments} comments</p>
        </div>
      </div>
    </div>
  );
};
export default FeedItem;
