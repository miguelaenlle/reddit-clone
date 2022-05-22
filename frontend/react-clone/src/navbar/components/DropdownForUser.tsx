import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import DropdownOption from "./DropdownOption";
import { useHistory, useLocation } from "react-router-dom";

const DropdownForUser: React.FC<{
  userId: string | null;
  username: string | null;
  optionIds: string[];
  optionValues: { [key: string]: string };
  optionIcons: { [key: string]: React.ReactElement };
  selectedOption: string;
  handleLogout: () => void;
  handleSelectedOption: (option: string) => void;
}> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };
  const handleSelectOption = (option: string) => {
    if (option === "profile") {
      history.push(`/user/${props.userId}`);
    } else if (option === "new_community") {
      history.push({
        pathname: `/create-sub`,
        state: {
          background: location,
        },
      });
    } else if (option === "new_post") {
      history.push({
        pathname: `/create-post`,
        state: {
          background: location,
        },
      });
    } 
    props.handleSelectedOption(option);
    setIsOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const topBorderRadius = "rounded-t-md";
  const bottomBorderRadius = "rounded-b-md";

  return (
    <div ref={dropdownRef}>
      <div
        onClick={handleClickOpen}
        className={`relative border ${
          isOpen ? "border-zinc-700" : "border-0"
        } group p-3 flex space-x-2 items-center hover:cursor-pointer h-10 ${topBorderRadius} ${
          !isOpen && bottomBorderRadius
        }`}
      >
        {props.optionIcons[props.selectedOption]}
        <p className="grow text-zinc-400 group-hover:text-white pr-10 transition-colors">
          {props.username ? `u/${props.username}` : "My Account"}
        </p>
        <ChevronUpIcon
          className={`text-zinc-400 w-4 h-4 group-hover:text-white transition-colors ${
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
            handleSelectedOption={props.handleLogout}
          />
        </ul>
      </div>
    </div>
  );
};
export default DropdownForUser;
