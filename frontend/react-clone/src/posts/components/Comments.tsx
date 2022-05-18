import { useEffect, useState } from "react";

import Dropdown from "../../shared/components/Dropdown";
import PostItem from "./PostItem";

import {
  sortOptionIcons,
  sortOptionIds,
  sortOptionValues,
} from "../constants/sort-options";

import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import PostItemLoader from "./PostItemLoader";

const Comments: React.FC<{
  post: Post;
}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("new");
  const httpClient = useHttpClient();

  const [comments, setComments] = useState<{ [key: string]: any }[]>([]);
  const handleNewComments = (newComments: { [key: string]: any }[]) => {
    setComments(newComments);
  };

  const sortComments = (selectedOption: string) => {
    if (selectedOption === "new") {
      setComments((previousComments) => {
        return [...previousComments].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      });
    } else if (selectedOption === "old") {
      setComments((previousComments) => {
        return [...previousComments].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      });
    } else if (selectedOption === "top") {
      setComments((previousComments) => {
        return [...previousComments].sort((a, b) => {
          return b.upvotes - a.upvotes;
        });
      });
    } else if (selectedOption === "controversial") {
      setComments((previousComments) => {
        return [...previousComments].sort((a, b) => {
          return a.upvotes - b.upvotes;
        });
      });
    }
  };

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

  const pullComments = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/posts/${props.post.id}/comments`;
      const result = await httpClient.sendRequest(url, "GET");
      const commentChain = result.commentsChain;
      const sortedComments = commentChain.sort(
        (
          comment1: { [key: string]: any },
          comment2: { [key: string]: any }
        ) => {
          return comment1.num_upvotes < comment2.num_upvotes ? 1 : -1;
        }
      );

      setComments(sortedComments);
    } catch (error) {}
  };

  const handleSelectedOption = (newSelectedOption: string) => {
    setSelectedOption(newSelectedOption);
  };

  useEffect(() => {
    pullComments();
  }, []);

  useEffect(() => {
    sortComments(selectedOption);
  }, [selectedOption]);

  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const totalComments = countComments();
    setCommentCount(totalComments);
  }, [comments]);

  const countComments = () => {
    // recursively count comment_ids and sum them into an integer
    let count = 0;
    const countCommentsRecursive = (comments: { [key: string]: any }[]) => {
      for (const comment of comments) {
        count += 1;
        if (comment.comment_ids) {
          countCommentsRecursive(comment.comment_ids);
        }
      }
    };
    countCommentsRecursive(comments);
    return count;
  };

  return (
    <div className="mt-5 p-5 mx-20 w/80 bg-zinc-800 border border-zinc-700 m-96">
      <div className="flex items-center space-x-5">
        <p className="text-white">{commentCount} comments</p>
        <Dropdown
          light={true}
          navbar={false}
          optionIds={sortOptionIds}
          optionValues={sortOptionValues}
          optionIcons={sortOptionIcons}
          selectedOption={selectedOption}
          handleSelectedOption={handleSelectedOption}
        />
      </div>
      {httpClient.isLoading ? (
        <div>
          <PostItemLoader />
          <PostItemLoader />
          <PostItemLoader />
        </div>
      ) : comments.length > 0 ? (
        comments.map((comment) => {
          return (
            <PostItem
              key={`comment-${comment._id}`}
              comment={comment}
              deleteComment={deleteComment}
            />
          );
        })
      ) : (
        <p className="mt-5 text-zinc-400">No comments yet.</p>
      )}
    </div>
  );
};
export default Comments;
