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

const Comments: React.FC<{ post: Post }> = (props) => {
  const [selectedOption, setSelectedOption] = useState("new");
  const httpClient = useHttpClient();

  const [comments, setComments] = useState<{ [key: string]: any }[]>([]);

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
    } catch (error) {
    }
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
          return <PostItem key={`comment-${comment._id}`} comment={comment} />;
        })
      ) : (
        <p className="mt-5 text-zinc-400">No comments yet.</p>
      )}
    </div>
  );
};
export default Comments;
