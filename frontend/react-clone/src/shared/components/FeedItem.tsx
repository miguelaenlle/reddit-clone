import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import VoteItem from "./VoteItem";
import { Post } from "../../models/Post";
import { useVotes } from "../../posts/hooks/use-votes";
import ImagePreview from "./ImagePreview";

const FeedItem: React.FC<{
  post: Post;
  handleUpdateLayout: () => void;
}> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [timeAgo, setTimeAgo] = useState<string | null>(null);

  const handleOpenSignup = () => {
    history.push({
      pathname: `/signup`,
      state: {
        background: location,
      },
    });
  };

  const votesHandler = useVotes(
    props.post.id,
    props.post.initialUpvotes,
    true,
    handleOpenSignup
  );

  const updateTimeAgo = () => {
    try {
      if (props.post.postDate) {
        setTimeAgo(moment(props.post.postDate).fromNow());
      }
    } catch {}
  };

  useEffect(() => {
    updateTimeAgo();
  }, []);
  const feedItemDivRef = useRef<HTMLDivElement | null>(null);

  const openPost = (e: React.MouseEvent<HTMLDivElement>) => {
    history.push({
      pathname: `/post/${props.post.id}`,
      state: {
        background: location,
      },
    });
  };
  const openSubreddit = () => {
    history.push(`/sub/${props.post.subId}`); // fix
  };
  const openUser = () => {
    history.push(`/user/${props.post.opId}`); // fix
  };

  return (
    <div className="w-full z-0 p-1.5">
      <ImagePreview
        post={props.post}
        handleUpdateLayout={props.handleUpdateLayout}
      />
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
        <div className="bg-zinc-400"></div>
        <p className="text-zinc-400">
          {props.post.isDeleted ? "[removed]" : ""}
        </p>
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
            isLoading={votesHandler.isLoading}
            voteDirection={votesHandler.voteDirection}
            handleUpvote={votesHandler.handleUpvote}
            handleDownvote={votesHandler.handleDownvote}
            numUpvotes={votesHandler.upvotes}
          />
          <div className="flex-grow"></div>
        </div>
      </div>
    </div>
  );
};
export default FeedItem;
