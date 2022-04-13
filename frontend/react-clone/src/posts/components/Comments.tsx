import { useState } from "react";

import Dropdown from "../../shared/components/Dropdown";
import PostItem from "./PostItem";

import {
  sortOptionIcons,
  sortOptionIds,
  sortOptionValues,
} from "../constants/sort-options";

const Comments: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("new");

  const handleSelectedOption = (newSelectedOption: string) => {
    setSelectedOption(newSelectedOption);
  };

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
        </PostItem>
      </PostItem>

      <PostItem>
        <PostItem></PostItem>
      </PostItem>
    </div>
  );
};
export default Comments;
