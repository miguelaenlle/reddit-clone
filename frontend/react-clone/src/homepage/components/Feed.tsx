import { useState } from "react";
import Dropdown from "../../navbar/components/Dropdown";

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
      <Dropdown
        navbar={false}
        optionIds={optionIds}
        optionValues={sortOptionValues}
        optionIcons={sortOptionIcons}
        selectedOption={selectedOption}
        handleSelectedOption={handleSelectedOption}
      />
    </div>
  );
};
export default Feed;
