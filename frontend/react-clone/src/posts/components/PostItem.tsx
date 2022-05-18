import VoteItem from "../../shared/components/VoteItem";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import {
  CheckIcon,
  PencilIcon,
  ReplyIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { imageCSS } from "../../shared/constants/image-class";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Comment } from "../../models/Comment";
import moment from "moment";
import CommentField from "./CommentField";
import { useComments } from "../hooks/use-comment";
import SubComments from "./SubComments";
import { AuthContext } from "../../context/auth-context";
import DeleteConfirmationButton from "./DeleteConfirmationButton";
import { useVotes } from "../hooks/use-votes";
import { useEditPost } from "../hooks/use-edits";
import LightButton from "../../shared/components/LightButton";
import InputField from "../../shared/components/InputField";
import { useEditComment } from "../hooks/use-edit-comment";

const PostItem: React.FC<{
  comment: { [key: string]: any };
  deleteComment: (commentId: string) => void;
}> = (props) => {
  const authContext = useContext(AuthContext);
  const [expanded, setExpanded] = useState(true);
  const [commentData, setCommentData] = useState<Comment | null>(null);
  const [comments, setComments] = useState<{ [key: string]: any }[]>(
    props.comment.comment_ids ? props.comment.comment_ids : []
  );

  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setIsDeleted(props.comment.deleted)
  }, [props.comment.deleted])
  

  const votesHandler = useVotes(
    props.comment._id,
    props.comment.upvotes ?? 0,
    false
  );

  const editsHandler = useEditComment(props.comment);

  const deleteComment = (commentId: string) => {
    try {
      setComments((prevComments) => {
        const filteredComments = prevComments.map((comment) => {
          if (commentId === comment._id) {
            comment.deleted = true;
            return comment;
          } else {
            return comment;
          }
        });
        return filteredComments;
      });
    } catch {}
  };

  const handleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const initializeCommentData = () => {
    try {
      const newComment = new Comment(
        props.comment._id,
        props.comment.comment_content,
        moment(props.comment.date).fromNow(),
        props.comment.deleted,
        props.comment.parent_is_post,
        props.comment.parent_post_id as string | undefined,
        props.comment.parent_comment_id as string | undefined,
        props.comment.upvotes,
        props.comment.user_id.username,
        props.comment.user_id._id
      );
      const initialUpvotes = newComment.upvotes ?? 0;
      setCommentData(newComment);
    } catch (error) {}
  };

  const handleComment = (comment: { [key: string]: any }) => {
    try {
      setComments((prevComments) => [comment, ...prevComments]);
    } catch {}
  };

  const commentsHandler = useComments(false, props.comment._id, handleComment);

  useEffect(() => {
    initializeCommentData();
  }, []);

  const subComments = useMemo(() => {
    return <SubComments comments={comments} deleteComment={deleteComment} />;
  }, [comments]);

  return (
    <div className="flex pt-5">
      <div onClick={handleExpand} className="group hover:cursor-pointer pr-3">
        <div className="group-hover:bg-zinc-400 bg-zinc-700 w-0.5 h-full"></div>
      </div>
      <div className="grow">
        {commentData ? (
          <React.Fragment>
            <p className={`text-white text-sm ${!expanded ? "py-2" : ""}`}>
              u/{commentData.author_name}
              <span className="text-zinc-400">{` ${commentData.date} `}</span>
            </p>
            {expanded && (
              <React.Fragment>
                {isDeleted ? (
                  <p className="text-zinc-400 py-3 text-base">{"[removed]"}</p>
                ) : (
                  <React.Fragment>
                    {editsHandler.editing ? (
                      <div className="pt-3 pb-0.5">
                        <InputField
                          name={""}
                          placeholder={"Comment"}
                          touched={undefined}
                          error={undefined}
                          value={editsHandler.newComment}
                          onBlur={() => {}}
                          onChange={editsHandler.handleNewComment}
                        />
                      </div>
                    ) : (
                      <p className="text-white py-3 text-base">
                        {editsHandler.commentText}
                      </p>
                    )}
                  </React.Fragment>
                )}

                {editsHandler.error && (
                  <p className="text-red-500 pb-2">{editsHandler.error}</p>
                )}
                <div className="flex space-x-4">
                  {!isDeleted && (
                    <React.Fragment>
                      <VoteItem
                        isLoading={votesHandler.isLoading}
                        voteDirection={votesHandler.voteDirection}
                        numUpvotes={votesHandler.upvotes}
                        handleUpvote={votesHandler.handleUpvote}
                        handleDownvote={votesHandler.handleDownvote}
                      />

                      {!commentsHandler.replying && !editsHandler.editing && (
                        <ButtonNoBorder
                          buttonImage={<ReplyIcon className={imageCSS} />}
                          buttonText={"Reply"}
                          handleClick={commentsHandler.handleReply}
                        />
                      )}
                      {editsHandler.canEdit && !editsHandler.editing && (
                        <React.Fragment>
                          <ButtonNoBorder
                            buttonImage={<PencilIcon className={imageCSS} />}
                            buttonText={"Edit"}
                            handleClick={editsHandler.handleOpenEditor}
                          />
                          <DeleteConfirmationButton
                            itemId={props.comment._id}
                            isPost={false}
                            deleteComment={props.deleteComment}
                          />
                        </React.Fragment>
                      )}
                      {editsHandler.editing && (
                        <div className="flex space-x-2">
                          <LightButton
                            loading={editsHandler.loading}
                            onClick={editsHandler.handleSubmitEdit}
                            buttonImage={<CheckIcon className={imageCSS} />}
                            buttonText="Confirm"
                          />
                          <LightButton
                            onClick={editsHandler.handleCloseEditor}
                            buttonImage={<XIcon className={imageCSS} />}
                            buttonText="Cancel"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>

                {commentsHandler.replying && (
                  <CommentField
                    isLoading={commentsHandler.isLoading}
                    replyText={commentsHandler.reply}
                    handleReplyChange={commentsHandler.handleReplyChange}
                    handleSubmitCommentToPost={
                      commentsHandler.handleSubmitCommentToPost
                    }
                    handleCloseReply={commentsHandler.handleCloseReply}
                    error={commentsHandler.error}
                    commentOnComment={true}
                  />
                )}

                {subComments}
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <div>
            <p
              className={`text-white italic text-sm ${!expanded ? "py-2" : ""}`}
            >
              {"[Comment failed to load]"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default PostItem;
