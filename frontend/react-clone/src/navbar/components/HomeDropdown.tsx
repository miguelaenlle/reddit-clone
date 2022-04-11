import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import DropdownOption from "./DropdownOption";
import { optionIcons, optionValues } from "../constants/option-icons";

const HomeDropdown: React.FC<{}> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("home");

  const highlighted = "border-t border-x border-zinc-700";
  const topBorderRadius = "rounded-t-md";
  const bottomBorderRadius = "rounded-b-md";
  const iconClass =
    "h-4 text-zinc-400 group-hover:text-white transition-colors";

  const handleClick = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const homeOption = (
    <DropdownOption
      optionId="home"
      optionIcon={optionIcons.home}
      optionText={optionValues.home}
      selectedOption={selectedOption}
      handleSelectedOption={handleSelectedOption}
    />
  );

  const mySubredditsOption = (
    <DropdownOption
      optionId="subreddits"
      optionIcon={optionIcons.subreddits}
      optionText={optionValues.subreddits}
      selectedOption={selectedOption}
      handleSelectedOption={handleSelectedOption}
    />
  );

  const allPostsOption = (
    <DropdownOption
      optionId="allPosts"
      optionIcon={optionIcons.allPosts}
      optionText={optionValues.allPosts}
      selectedOption={selectedOption}
      handleSelectedOption={handleSelectedOption}
    />
  );

  const dropdown = (
    <div
      id="dropdown"
      className={`${
        !isOpen ? "hidden" : ""
      } absolute z-10 w-60 border-b border-x rounded-b-md border-zinc-700 bg-zinc-800`}
    >
      <ul className="py-1 " aria-labelledby="dropdownDefault">
        {homeOption}
        {mySubredditsOption}
        {allPostsOption}
      </ul>
    </div>
  );

  return (
    <div>
      <div
        onClick={handleClick}
        className={`border border-zinc-700 group p-3 w-60 flex space-x-2 items-center hover:cursor-pointer h-10 ${
          isOpen && highlighted
        } ${topBorderRadius} ${!isOpen && bottomBorderRadius}`}
      >
        {optionIcons[selectedOption]}
        <p className="grow text-zinc-400 group-hover:text-white pr-10 transition-colors">
          {optionValues[selectedOption]}
        </p>
        {isOpen ? (
          <ChevronDownIcon className="text-zinc-400 h-4 group-hover:text-white transition-colors" />
        ) : (
          <ChevronUpIcon className="text-zinc-400 h-4 group-hover:text-white transition-colors" />
        )}
      </div>
      {dropdown}
    </div>
  );
};
export default HomeDropdown;
