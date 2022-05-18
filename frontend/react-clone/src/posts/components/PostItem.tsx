import VoteItem from "../../shared/components/VoteItem";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import {
  PencilIcon,
  ReplyIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { imageCSS } from "../../shared/constants/image-class";
import React, { useContext, useEffect, useState } from "react";
import { Comment } from "../../models/Comment";
import moment from "moment";
import CommentField from "./CommentField";
import { useComments } from "../hooks/use-comment";
import SubComments from "./SubComments";
import { AuthContext } from "../../context/auth-context";
import DeleteConfirmationButton from "./DeleteConfirmationButton";

const PostItem: React.FC<{
  comment: { [key: string]: any };
  deleteComment: (commentId: string) => void;
}> = (props) => {
  const authContext = useContext(AuthContext);
  const [voteDirection, setVoteDirection] = useState(0);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [expanded, setExpanded] = useState(true);
  const [commentData, setCommentData] = useState<Comment | null>(null);
  const [comments, setComments] = useState<{ [key: string]: any }[]>(
    props.comment.comment_ids ? props.comment.comment_ids : []
  );
  const [canEdit, setCanEdit] = useState(false);

  const deleteComment = (commentId: string) => {
    try {
      setComments((prevComments) => {
        console.log(prevComments);
        const filteredComments = prevComments.map((comment) => {
          if (commentId === comment._id) {
            comment.deleted = true;
            return comment;
          } else {
            return comment;
          }
        });
        console.log("Filtered comments", filteredComments);
        return filteredComments;
      });
    } catch {}
  };

  useEffect(() => {
    const userId = authContext?.userId;
    if (userId) {
      const commentUserId = props.comment?.user_id?._id;
      if (userId === commentUserId) {
        // check if the user is allowed to edit
        setCanEdit(true);
      }
    }
  }, [authContext?.userId]);

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
      setUpvotes(initialUpvotes);
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
                {props.comment.deleted ? (
                  <p className="text-zinc-400 py-3 text-base">{"[removed]"}</p>
                ) : (
                  <p className="text-white py-3 text-base">
                    {commentData.comment_content}
                  </p>
                )}
                <div className="flex space-x-4">
                  {!commentData.deleted && (
                    <React.Fragment>
                      <VoteItem
                        isLoading={false}
                        voteDirection={voteDirection}
                        numUpvotes={commentData.upvotes}
                        handleUpvote={handleUpvote}
                        handleDownvote={handleDownvote}
                      />

                      {!commentsHandler.replying && (
                        <ButtonNoBorder
                          buttonImage={<ReplyIcon className={imageCSS} />}
                          buttonText={"Reply"}
                          handleClick={commentsHandler.handleReply}
                        />
                      )}
                      {canEdit && (
                        <React.Fragment>
                          <ButtonNoBorder
                            buttonImage={<PencilIcon className={imageCSS} />}
                            buttonText={"Edit"}
                            handleClick={() => {}}
                          />
                          <DeleteConfirmationButton
                            itemId={props.comment._id}
                            isPost={false}
                            deleteComment={props.deleteComment}
                          />
                        </React.Fragment>
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

                <SubComments
                  comments={comments}
                  deleteComment={deleteComment}
                />
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
