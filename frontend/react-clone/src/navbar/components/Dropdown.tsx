import { ChevronUpIcon } from "@heroicons/react/outline";
import { useState } from "react";
import DropdownOption from "./DropdownOption";

const Dropdown: React.FC<{
  navbar?: boolean;
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
  }

  const topBorderRadius = "rounded-t-md";
  const bottomBorderRadius = "rounded-b-md";

  return (
    <div className = {isOpen ? "drop-shadow" : ""}>
      <div
        onClick={handleClickOpen}
        className={`border border-zinc-700 group p-3 w-60 flex space-x-2 items-center hover:cursor-pointer h-10 ${topBorderRadius} ${
          !isOpen && bottomBorderRadius
        }`}
      >
        {props.optionIcons[props.selectedOption]}
        <p className="grow text-zinc-400 group-hover:text-white pr-10 transition-colors">
          {props.optionValues[props.selectedOption]}
        </p>
        <ChevronUpIcon className={`text-zinc-400 h-4 group-hover:text-white transition-colors ${isOpen ? "rotate-180" : ""} transition-transform`} />
      
      </div>
      <div
        id="dropdown"
        className={`${
          !isOpen ? "hidden" : ""
        } absolute ${props.navbar ? "z-15" : "z-10"} w-60 border-b border-x rounded-b-md border-zinc-700 bg-zinc-800 animate-fade`}
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
        </ul>
      </div>
    </div>
  );
};
export default Dropdown;
