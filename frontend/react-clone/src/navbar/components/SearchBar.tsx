import { useEffect, useRef, useState } from "react";
import SearchPopup from "../../search/components/SearchPopup";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC<{}> = (props) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [popupDisplayed, setPopupDisplayed] = useState(false);
  const updateSearchResults = () => {};
  const handleSearchQuery = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleConfirmSearch = () => {
    console.log("Search...")
    navigate(`search?query=${searchQuery}`);
    setPopupDisplayed(false);
  };

  const handleOpenInput = () => {
    
  };

  const handleCloseInput = () => {
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
    <div className="relative flex-grow">
      <input
        onFocus={handleOpenInput}
        // onBlur={handleCloseInput}
        placeholder="Search"
        className="relative w-full border border-zinc-700 space-x-2 h-10 rounded-md bg-transparent text-white placeholder-zinc-400 px-3 selected:border-1"
        onChange={handleSearchQuery}
      ></input>
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
