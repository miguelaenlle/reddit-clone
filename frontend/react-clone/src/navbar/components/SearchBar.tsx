import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SearchPopup from "../../search/components/SearchPopup";
import { XIcon } from "@heroicons/react/outline";

const SearchBar: React.FC<{}> = (props) => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [popupDisplayed, setPopupDisplayed] = useState(false);
  const updateSearchResults = () => {};
  const handleSearchQuery = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleConfirmSearch = () => {
    console.log("Search...");
    history.push(`search?query=${searchQuery}`);
    setPopupDisplayed(false);
  };

  const handleOpenInput = () => {};

  const handleCloseInput = () => {
    console.log("Handle close input...");
    setPopupDisplayed(false);
  };

  const handleClickOutside = () => {
    console.log("Clicked outside.");
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
    <div className="relative flex-grow">
      <div className="relative">
        <input
          onFocus={handleOpenInput}
          placeholder="Search"
          className="z-10 relative w-full border border-zinc-700 space-x-2 h-10 rounded-md bg-transparent text-white placeholder-zinc-400 px-3 selected:border-1"
          onBlur={handleCloseInput}
          onChange={handleSearchQuery}
        ></input>
      </div>
      {popupDisplayed && (
        <SearchPopup
          query={searchQuery}
          handleConfirmSearch={handleConfirmSearch}
        />
      )}
    </div>
  );
};
export default SearchBar;
