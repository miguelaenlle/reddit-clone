import {
  AnnotationIcon,
  ArrowRightIcon,
  ChatIcon,
  CheckIcon,
  PencilIcon,
  ReplyIcon,
  XIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import React, { useState } from "react";
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
import { useComments } from "../hooks/use-comment";
import CommentField from "./CommentField";
import ImagePreview from "../../shared/components/ImagePreview";

const PrimaryContent: React.FC<{
  post: Post;
  addComment: (comment: { [key: string]: any }) => void;
}> = (props) => {
  const editsHandler = useEditPost(props.post);
  const votesHandler = useVotes(props.post.id, props.post.initialUpvotes, true);
  const commentsHandler = useComments(true, props.post.id, props.addComment);

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
          <p
            className={`pt-3 ${
              editsHandler.newTitle.length > 0 &&
              editsHandler.newTitle.length < 40
                ? "text-zinc-400"
                : `text-red-500`
            }`}
          >
            {editsHandler.newTitle.length}/40
          </p>
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
              <p
                className={`pt-1 ${
                  editsHandler.newDescription.length >= 0 &&
                  editsHandler.newDescription.length < 300
                    ? "text-zinc-400"
                    : `text-red-500`
                }`}
              >
                {editsHandler.newDescription.length}/300
              </p>
            </div>
          ) : (
            <p className="mt-3 text-zinc-200 text-lg">
              {editsHandler.description}
            </p>
          )}

          {editsHandler.isEditing && editsHandler.error && (
            <p className="pt-5 text-red-500 text-lg">{editsHandler.error}</p>
          )}
          <div className = "pt-5">
            <ImagePreview post={props.post} />
          </div>
          <div className="mt-14 space-x-2 flex">
            {!editsHandler.isEditing && (
              <React.Fragment>
                <VoteItem
                  isLoading={votesHandler.isLoading}
                  voteDirection={votesHandler.voteDirection}
                  numUpvotes={votesHandler.upvotes}
                  handleUpvote={votesHandler.handleUpvote}
                  handleDownvote={votesHandler.handleDownvote}
                />
                {!commentsHandler.replying && (
                  <LightButton
                    onClick={commentsHandler.handleReply}
                    buttonImage={<ReplyIcon className={imageCSS} />}
                    buttonText="Reply"
                  />
                )}
              </React.Fragment>
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
                    <DeleteConfirmationButton
                      itemId={props.post.id}
                      isPost={true}
                    />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )}

      {commentsHandler.replying && (
        <CommentField
          isLoading={commentsHandler.isLoading}
          replyText={commentsHandler.reply}
          handleReplyChange={commentsHandler.handleReplyChange}
          handleSubmitCommentToPost={commentsHandler.handleSubmitCommentToPost}
          handleCloseReply={commentsHandler.handleCloseReply}
          error={commentsHandler.error}
          commentOnComment={false}
        />
      )}
    </div>
  );
};
export default PrimaryContent;
