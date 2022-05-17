import VoteItem from "../../shared/components/VoteItem";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import { PencilIcon, ReplyIcon, TrashIcon } from "@heroicons/react/outline";
import { imageCSS } from "../../shared/constants/image-class";
import React, { useEffect, useState } from "react";
import { Comment } from "../../models/Comment";
import moment from "moment";

const PostItem: React.FC<{ comment: { [key: string]: any } }> = (props) => {
  const [voteDirection, setVoteDirection] = useState(0);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [expanded, setExpanded] = useState(true);
  const [commentData, setCommentData] = useState<Comment | null>(null);

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

  const initilaizeCommentData = () => {
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

  useEffect(() => {
    initilaizeCommentData();
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
                <p className="text-white py-3 text-base">
                  {commentData.comment_content}
                </p>
                <div className="flex space-x-4">
                  <VoteItem
                    isLoading={false}
                    voteDirection={voteDirection}
                    numUpvotes={commentData.upvotes}
                    handleUpvote={handleUpvote}
                    handleDownvote={handleDownvote}
                  />
                  <ButtonNoBorder
                    buttonImage={<ReplyIcon className={imageCSS} />}
                    buttonText={"Reply"}
                    handleClick={() => {
                      
                    }}
                  />
                </div>
                {props.comment.comment_ids && (
                  <React.Fragment>
                    {/* <div>{props.comment.comment_ids.length}</div> */}
                    
                    {props.comment.comment_ids.sort((comment1: any, comment2: any) => {
                      return comment1.date < comment2.date ? 1 : -1
                    }).map(
                      (commentData: { [key: string]: any }) => {
                        return (
                          <PostItem
                            key={`comment-response-${Math.random().toString()}`}
                            comment={commentData}
                          />
                        );
                      }
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <div>
            <p
              className={`text-white italic text-sm ${!expanded ? "py-2" : ""}`}
            >
              This comment failed to load.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default PostItem;
