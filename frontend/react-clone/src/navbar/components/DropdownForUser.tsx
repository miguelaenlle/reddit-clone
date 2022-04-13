import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import DropdownOption from "./DropdownOption";

const DropdownForUser: React.FC<{
  username: string;
  optionIds: string[];
  optionValues: { [key: string]: string };
  optionIcons: { [key: string]: React.ReactElement };
  selectedOption: string;
  handleSelectedOption: (option: string) => void;
}> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };
  const handleSelectOption = (option: string) => {
    props.handleSelectedOption(option);
    setIsOpen(false);
  };

  const topBorderRadius = "rounded-t-md";
  const bottomBorderRadius = "rounded-b-md";

  return (
    <div>
      <div
        onClick={handleClickOpen}
        className={`relative border ${isOpen ? "border-zinc-700" : "border-0"} group p-3 w-60 flex space-x-2 items-center hover:cursor-pointer h-10 ${topBorderRadius} ${
          !isOpen && bottomBorderRadius
        }`}
      >
        {props.optionIcons[props.selectedOption]}
        <p className="grow text-zinc-400 group-hover:text-white pr-10 transition-colors">
          {`u/${props.username}`}
        </p>
        <ChevronUpIcon
          className={`text-zinc-400 h-4 group-hover:text-white transition-colors ${
            isOpen ? "rotate-180" : ""
          } transition-transform`}
        />
      </div>
      <div
        id="dropdown"
        className={`${
          !isOpen ? "hidden" : ""
        } absolute z-10 w-60 border-b border-x rounded-b-md border-zinc-700 bg-zinc-800 animate-fade`}
      >
        <ul className="py-1 " aria-labelledby="dropdownDefault">
          {props.optionIds.map((optionId) => (
            <DropdownOption
              key={optionId}
              optionId={optionId}
              optionIcon={props.optionIcons[optionId]}
              optionText={props.optionValues[optionId]}
              selectedOption={props.selectedOption}
              handleSelectedOption={handleSelectOption}
            />
          ))}
          <div className="border-t my-1 border-zinc-700"></div>

          <DropdownOption
            key={"logout"}
            optionId={"logout"}
            optionIcon={props.optionIcons["logout"]}
            optionText={props.optionValues["logout"]}
            selectedOption={props.selectedOption}
            handleSelectedOption={handleSelectOption}
          />
        </ul>
      </div>
    </div>
  );
};
export default DropdownForUser;
