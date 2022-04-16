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

const Comments: React.FC<{ post: Post }> = (props) => {
  const [selectedOption, setSelectedOption] = useState("new");
  const httpClient = useHttpClient();

  const [comments, setComments] = useState<{ [key: string]: any }[]>([]);

  const pullComments = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/posts/${props.post.id}/comments`;
      console.log(url);
      const result = await httpClient.sendRequest(url, "GET");
      const commentChain = result.commentsChain;

      console.log("Pull comments", commentChain);
      setComments(commentChain);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedOption = (newSelectedOption: string) => {
    setSelectedOption(newSelectedOption);
  };

  useEffect(() => {
    pullComments();
  }, []);

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
      {comments.map((comment) => {
        return <PostItem key={`comment-${comment._id}`} comment={comment} />;
      })}
    </div>
  );
};
export default Comments;
