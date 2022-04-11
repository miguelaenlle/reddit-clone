import { useState } from "react";
import {
  optionIds,
  pageOptionIcons,
  pageOptionValues,
} from "../constants/page-options";
import Dropdown from "../../shared/components/Dropdown";

const HomeDropdown: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("home");

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <Dropdown
      navbar={true}
      optionIds={optionIds}
      optionValues={pageOptionValues}
      optionIcons={pageOptionIcons}
      selectedOption={selectedOption}
      handleSelectedOption={handleSelectedOption}
    />
  );
};
export default HomeDropdown;
