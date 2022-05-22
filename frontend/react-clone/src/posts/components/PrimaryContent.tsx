import {
  CheckIcon,
  PencilIcon,
  ReplyIcon,
  XIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Post } from "../../models/Post";
import ImagePreview from "../../shared/components/ImagePreview";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import TextField from "../../shared/components/TextField";
import VoteItem from "../../shared/components/VoteItem";
import { imageCSS } from "../../shared/constants/image-class";
import { useComments } from "../hooks/use-comment";
import { useEditPost } from "../hooks/use-edits";
import { useVotes } from "../hooks/use-votes";
import CommentField from "./CommentField";
import DeleteConfirmationButton from "./DeleteConfirmationButton";

const PrimaryContent: React.FC<{
  post: Post;
  addComment: (comment: { [key: string]: any }) => void;
}> = (props) => {
  const editsHandler = useEditPost(props.post);

  const location = useLocation();
  const history = useHistory();

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
  const commentsHandler = useComments(true, props.post.id, props.addComment);

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
          <div className="pt-5">
            <ImagePreview post={props.post} handleUpdateLayout={() => {}} />
          </div>
          <div className="mt-14 md:space-x-2 md:flex xs:space-y-2">
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
                    fullWidth={true}
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
                      fullWidth={true}
                    />
                    <LightButton
                      onClick={editsHandler.handleEndEditMode}
                      buttonImage={<XIcon className={imageCSS} />}
                      buttonText="Cancel"
                      fullWidth={true}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <LightButton
                      onClick={editsHandler.handleStartEditMode}
                      buttonImage={<PencilIcon className={imageCSS} />}
                      buttonText="Edit"
                      fullWidth={true}
                    />
                    <DeleteConfirmationButton
                      itemId={props.post.id}
                      isPost={true}
                      fullWidth={true}
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
