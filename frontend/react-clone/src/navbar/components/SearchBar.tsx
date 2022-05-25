import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SearchPopup from "../../search/components/SearchPopup";
import { ChevronRightIcon, XIcon } from "@heroicons/react/outline";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import { imageCSS } from "../../shared/constants/image-class";

const SearchBar: React.FC<{
  isCompact: boolean;
  isMobile?: boolean;
  displayedValue?: string;
  handleSelectResult?: (name: string, subId: string) => void;
  handleClose?: () => void;
}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const httpClient = useHttpClient();
  const history = useHistory();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [popupDisplayed, setPopupDisplayed] = useState(false);

  const [results, setResults] = useState<Subreddit[]>([]);

  useEffect(() => {
    setIsLoading(httpClient.isLoading);
  }, [httpClient.isLoading]);

  const updateSearchResults = async (searchQuery: string) => {
    try {
      if (searchQuery && searchQuery.length > 0) {
        const searchResultsFormatted = await httpClient.fetchSubreddits(
          searchQuery,
          0,
          props.isCompact ? 5 : 7
        );
        if (searchResultsFormatted) {
          setResults(searchResultsFormatted);
        }
      }
    } catch (error) {}
  };

  const handleSearchQuery = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleConfirmSearch = () => {
    if (searchQuery.length > 0) {
      let pathExt = "subreddits";

      for (const term of ["users", "posts"]) {
        if (location.pathname.includes(term)) {
          pathExt = term;
        }
      }

      history.push(`/search/${pathExt}?query=${searchQuery}`);
      setPopupDisplayed(false);
      if (props.isMobile && props.handleClose) {
        props.handleClose();
      }
    }
  };
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (props.isCompact && !props.isMobile) {
        if (props.handleSelectResult && results[0]) {
          props.handleSelectResult(results[0].subName, results[0].subId);
          setPopupDisplayed(false);
        }
      } else {
        handleConfirmSearch();
      }
    }
  };

  const handleChooseItem = (name: string, subId: string) => {
    if (!props.isCompact) {
      history.push(`/sub/${subId}`);
      setPopupDisplayed(false);
    } else {
      if (props.handleSelectResult) {
        props.handleSelectResult(name, subId);
        setPopupDisplayed(false);
      }
    }
  };

  const handleOpenInput = () => {
    setPopupDisplayed(true);
  };

  const handleCloseInput = () => {
    setPopupDisplayed(false);
  };

  const handleClickOutside = () => {};

  useEffect(() => {
    if (!props.isMobile) {
      if (searchQuery.length > 0) {
        if (!popupDisplayed) {
          setPopupDisplayed(true);
        }
      }
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setIsLoading(false);
        if (searchQuery.length > 0) {
          if (!popupDisplayed) {
            setPopupDisplayed(true);
          }
          updateSearchResults(searchQuery);
          setSearchQuery(searchQuery);
        } else {
          if (popupDisplayed) {
            setPopupDisplayed(false);
          }
          setSearchQuery(searchQuery);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, props.isMobile]);

  return (
    <div className="relative flex-grow">
      <div className="relative phone:flex">
        <input
          onFocus={handleOpenInput}
          placeholder="Search"
          className={`z-10 relative w-full border border-zinc-700 space-x-2 h-10 ${
            props.isCompact ? "" : "rounded-md"
          } bg-transparent text-white placeholder-zinc-400 px-3 selected:border-1`}
          onBlur={handleCloseInput}
          onChange={handleSearchQuery}
          onKeyDown={handleEnter}
        ></input>
        {props.isMobile && (
          <div
            onClick={handleConfirmSearch}
            className="group computer:hidden flex items-center px-2"
          >
            <ChevronRightIcon
              className={"w-7 h-7 text-zinc-200 group-hover:text-zinc-400"}
            />
          </div>
        )}
      </div>
      {(popupDisplayed && searchQuery.length && !props.isMobile) > 0 && (
        <SearchPopup
          isCompact={props.isCompact}
          loading={isLoading}
          query={searchQuery}
          results={results}
          handleConfirmSearch={handleConfirmSearch}
          handleChooseItem={handleChooseItem}
        />
      )}
    </div>
  );
};
export default SearchBar;
