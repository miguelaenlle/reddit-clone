import { ChevronUpIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import DropdownOption from "../../navbar/components/DropdownOption";
import SearchItem from "../../search/components/SearchItem";
import SearchLoader from "../../search/components/SearchLoader";
import SearchPopup from "../../search/components/SearchPopup";

const DropdownTextField: React.FC<{
  selectedOption: string;
  touched: boolean | undefined;
  handleSelectedOption: (option: string) => void;
  error: string | undefined;
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => void;
}> = (props) => {
  const [popupDisplayed, setPopupDisplayed] = useState(false);
  const [displayedReddit, setDisplayedReddit] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleOpenInput = () => {
    setPopupDisplayed(true);
  };

  const handleCloseInput = () => {
    setPopupDisplayed(false);
  };
  const handleSearchQuery = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleConfirmSearch = (searchTerm: string) => {
    props.handleSelectedOption(searchTerm);
    setDisplayedReddit(searchTerm);
    setPopupDisplayed(false);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      if (!popupDisplayed) {
        setPopupDisplayed(true);
      }
    }
    const timeout = setTimeout(() => {
      if (searchQuery.length > 0) {
        if (!popupDisplayed) {
          setPopupDisplayed(true);
        }
        setSearchQuery(searchQuery);
      } else {
        if (popupDisplayed) {
          setPopupDisplayed(false);
        }
        setSearchQuery(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div id="subreddit" className="relative flex-grow" onBlur={props.onBlur}>
      {!popupDisplayed ? (
        <div
          onClick={handleOpenInput}
          className={`flex items-center relative w-full border ${
            props.error ? "border-red-500" : "border-zinc-700"
          } space-x-2 h-10  bg-transparent text-white placeholder-zinc-400 px-3 hover:cursor-pointer`}
        >
          {displayedReddit ? (
            <p className="text-zinc-200">r/{displayedReddit}</p>
          ) : (
            <p className="text-zinc-400">Choose a subreddit...</p>
          )}
        </div>
      ) : (
        <>
          <input
            value={searchQuery}
            onFocus={handleOpenInput}
            // onBlur={handleCloseInput}
            placeholder="Choose a subreddit to post to..."
            className="relative w-full border border-zinc-700 space-x-2 h-10 bg-transparent text-white placeholder-zinc-400 px-3 selected:border-1"
            onChange={handleSearchQuery}
          ></input>
          {popupDisplayed && (
            <div className="absolute w-full mt-1 py-1 hover:cursor-pointer bg-zinc-800 border border-white rounded-md">
              <SearchItem
                subName={"gaming"}
                handleClick={handleConfirmSearch}
              />
              <SearchItem
                subName={"battlestations"}
                handleClick={handleConfirmSearch}
              />
              <SearchLoader />
            </div>
          )}
        </>
      )}

      {props.touched && props.error ? (
        <div className="mt-1 mb-1 text-red-500">{props.error}</div>
      ) : null}
    </div>
  );
};
export default DropdownTextField;
