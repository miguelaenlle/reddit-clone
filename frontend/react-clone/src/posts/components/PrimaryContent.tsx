import React, { useContext, useEffect, useState } from "react";

import { Post } from "../../models/Post";
import LightButton from "../../shared/components/LightButton";
import VoteItem from "../../shared/components/VoteItem";
import { ReplyIcon, PencilIcon, XIcon } from "@heroicons/react/outline";

import { imageCSS } from "../../shared/constants/image-class";
import { useHistory } from "react-router-dom";
import moment from "moment";
import DeleteConfirmationButton from "./DeleteConfirmationButton";
import { AuthContext } from "../../context/auth-context";

const PrimaryContent: React.FC<{
  post: Post;
}> = (props) => {
  const history = useHistory();
  const [upvotes, setUpvotes] = useState(0);
  const [voteDirection, setVoteDirection] = useState(0);
  const [editor, setEditor] = useState(false);
  const authContext = useContext(AuthContext)

  useEffect(() => {
    const userId = authContext?.userId;
    if (userId) {
      if (userId === props.post.opId) {
        setEditor(true);
      }
    }
  }, [authContext?.userId])


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

  const openUser = () => {
    history.push(`/user/${props.post.opId}`);
  };

  const openSubreddit = () => {
    history.push(`/sub/${props.post.subId}`);
  };

  return (
    <div>
      <p>
        <span
          onClick={openUser}
          className="text-sm text-white hover:underline hover:cursor-pointer"
        >
          u/{props.post.opName}
        </span>{" "}
        <span className="text-zinc-400">
          on{" "}
          <span
            onClick={openSubreddit}
            className="hover:underline hover:cursor-pointer"
          >
            r/{props.post.subName}
          </span>{" "}
          {moment(props.post.postDate).fromNow()}
        </span>{" "}
      </p>
      <h1 className="mt-1.5 text-3xl text-white">{props.post.title}</h1>
      {props.post.isDeleted ? (
        <p className = "text-zinc-200">[removed]</p>
      ) : (
        <React.Fragment>
          <p className="mt-3 text-zinc-200 text-lg">{props.post.text}</p>
          <div className="mt-14 space-x-2 flex">
            <VoteItem
              voteDirection={voteDirection}
              numUpvotes={upvotes}
              handleUpvote={handleUpvote}
              handleDownvote={handleDownvote}
            />
            <LightButton
              buttonImage={<ReplyIcon className={imageCSS} />}
              buttonText="Reply"
            />
            {editor && (
              <React.Fragment>
                <LightButton
                  buttonImage={<PencilIcon className={imageCSS} />}
                  buttonText="Edit"
                />
                <DeleteConfirmationButton postId={props.post.id} />
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      
      )}
    </div>
  );
};
export default PrimaryContent;
