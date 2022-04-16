import { useEffect, useState } from "react";

import Dropdown from "../../shared/components/Dropdown";
import PostItem from "./PostItem";

import {
  sortOptionIcons,
  sortOptionIds,
  sortOptionValues,
} from "../constants/sort-options";

import { useHttpClient } from "../../hooks/http-hook";

const Comments: React.FC<{ postId: string }> = (props) => {
  const [selectedOption, setSelectedOption] = useState("new");
  const httpClient = useHttpClient();

  const pullComments = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/posts/${props.postId}/comments`;
      console.log(url);
      const result = await httpClient.sendRequest(url, "GET");
      console.log("Pull comments", result);
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
        <p className="text-white">579 comments</p>
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
      <PostItem>
        <PostItem>
          <PostItem>
            <PostItem></PostItem>
          </PostItem>
          <PostItem>
            <PostItem></PostItem>
          </PostItem>
        </PostItem>
      </PostItem>

      <PostItem>
        <PostItem></PostItem>
      </PostItem>
    </div>
  );
};
export default Comments;
