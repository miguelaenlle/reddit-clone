import { PencilIcon, ReplyIcon } from "@heroicons/react/outline";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { Post } from "../../models/Post";
import LightButton from "../../shared/components/LightButton";
import VoteItem from "../../shared/components/VoteItem";
import { imageCSS } from "../../shared/constants/image-class";
import DeleteConfirmationButton from "./DeleteConfirmationButton";
import { useVotes } from "../hooks/use-votes";

const PrimaryContent: React.FC<{
  post: Post;
}> = (props) => {
  const votesHandler = useVotes(props.post.id, props.post.initialUpvotes);
  const history = useHistory();
  const [editor, setEditor] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const userId = authContext?.userId;
    if (userId) {
      if (userId === props.post.opId) {
        setEditor(true);
      }
    }
  }, [authContext?.userId]);

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
        <p className="text-zinc-200">[removed]</p>
      ) : (
        <React.Fragment>
          <p className="mt-3 text-zinc-200 text-lg">{props.post.text}</p>
          <div className="mt-14 space-x-2 flex">
            <VoteItem
              isLoading={votesHandler.isLoading}
              voteDirection={votesHandler.voteDirection}
              numUpvotes={votesHandler.upvotes}
              handleUpvote={votesHandler.handleUpvote}
              handleDownvote={votesHandler.handleDownvote}
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
