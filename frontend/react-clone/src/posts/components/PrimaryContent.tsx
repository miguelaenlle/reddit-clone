import {
  CheckIcon,
  PencilIcon,
  ReplyIcon,
  XIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import React from "react";
import { useHistory } from "react-router-dom";
import { Post } from "../../models/Post";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import TextField from "../../shared/components/TextField";
import VoteItem from "../../shared/components/VoteItem";
import { imageCSS } from "../../shared/constants/image-class";
import { useVotes } from "../hooks/use-votes";
import { useEditPost } from "../hooks/use-edits";
import DeleteConfirmationButton from "./DeleteConfirmationButton";

const PrimaryContent: React.FC<{
  post: Post;
}> = (props) => {
  const editsHandler = useEditPost(props.post);
  const votesHandler = useVotes(props.post.id, props.post.initialUpvotes);
  const history = useHistory();

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
      {editsHandler.isEditing ? (
        <div className="pt-5">
          <TextField
            fieldType="text"
            name="title"
            touched={undefined}
            error={undefined}
            placeholder="New Title"
            onBlur={() => {}}
            onChange={editsHandler.handleUpdateTitle}
            value={editsHandler.newTitle}
          />
        </div>
      ) : (
        <h1 className="mt-1.5 text-3xl text-white">{editsHandler.title}</h1>
      )}
      {props.post.isDeleted ? (
        <p className="text-zinc-200">[removed]</p>
      ) : (
        <React.Fragment>
          {editsHandler.isEditing ? (
            <div className="pt-3">
              <InputField
                name={""}
                placeholder={"New Description"}
                touched={undefined}
                error={undefined}
                value={editsHandler.newDescription}
                onBlur={() => {}}
                onChange={editsHandler.handleUpdateDescription}
              />
            </div>
          ) : (
            <p className="mt-3 text-zinc-200 text-lg">
              {editsHandler.description}
            </p>
          )}
          <div className="mt-14 space-x-2 flex">
            <VoteItem
              isLoading={votesHandler.isLoading}
              voteDirection={votesHandler.voteDirection}
              numUpvotes={votesHandler.upvotes}
              handleUpvote={votesHandler.handleUpvote}
              handleDownvote={votesHandler.handleDownvote}
            />
            {!editsHandler.isEditing && (
              <LightButton
                buttonImage={<ReplyIcon className={imageCSS} />}
                buttonText="Reply"
              />
            )}
            {editsHandler.editor && (
              <React.Fragment>
                {editsHandler.isEditing ? (
                  <React.Fragment>
                    <LightButton
                      loading={editsHandler.isLoading}
                      onClick={editsHandler.handleSubmit}
                      buttonImage={<CheckIcon className={imageCSS} />}
                      buttonText="Finish"
                    />
                    <LightButton
                      onClick={editsHandler.handleEndEditMode}
                      buttonImage={<XIcon className={imageCSS} />}
                      buttonText="Cancel"
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <LightButton
                      onClick={editsHandler.handleStartEditMode}
                      buttonImage={<PencilIcon className={imageCSS} />}
                      buttonText="Edit"
                    />
                    <DeleteConfirmationButton postId={props.post.id} />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
export default PrimaryContent;
