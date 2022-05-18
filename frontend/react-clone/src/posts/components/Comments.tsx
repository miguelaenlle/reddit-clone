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
import { reverse } from "dns";
import PostItemLoader from "./PostItemLoader";
import { Comment } from "../../models/Comment";

const Comments: React.FC<{
  post: Post;
  comments: { [key: string]: any }[];
  handleNewComments: (newComments: { [key: string]: any }[]) => void;
  sortComments: (selectedOption: string) => void;
}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("new");
  const httpClient = useHttpClient();

  const [comments, setComments] = useState<{ [key: string]: any }[]>([]);

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
    props.sortComments(selectedOption);
  }, [selectedOption]);

  return (
    <div className="mt-5 p-5 mx-20 w/80 bg-zinc-800 border border-zinc-700 m-96">
      <div className="flex items-center space-x-5">
        <p className="text-white">{props.post.numComments} comments</p>
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
