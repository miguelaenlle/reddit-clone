import { useState } from "react";
import Dropdown from "../../shared/components/Dropdown";
import NewPostButton from "./NewPostButton";
import NewCommunityButton from "./NewCommunityButton";

import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../constants/sort-modes";

const Feed: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="pt-20 px-5">
      <div className="flex space-x-2">
        <Dropdown
          navbar={false}
          optionIds={optionIds}
          optionValues={sortOptionValues}
          optionIcons={sortOptionIcons}
          selectedOption={selectedOption}
          handleSelectedOption={handleSelectedOption}
        />
        <NewPostButton />
        <NewCommunityButton />
      </div>
    </div>
  );
};
export default Feed;
