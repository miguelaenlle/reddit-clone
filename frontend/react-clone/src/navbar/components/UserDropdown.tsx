import { useState } from "react";
import {
  optionIds,
  userOptionIcons,
  userOptionValues,
} from "../constants/user-options";
import DropdownForUser from "./DropdownForUser";

const UserDropdown: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("user");

  const handleSelectedOption = (option: string) => {};

  return (
    <DropdownForUser
      username={"nexus"}
      optionIds={optionIds}
      optionValues={userOptionValues}
      optionIcons={userOptionIcons}
      selectedOption={selectedOption}
      handleSelectedOption={handleSelectedOption}
    />
  );
};
export default UserDropdown;
