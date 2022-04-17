import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SearchPopup from "../../search/components/SearchPopup";
import { XIcon } from "@heroicons/react/outline";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";

const SearchBar: React.FC<{}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const httpClient = useHttpClient();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [popupDisplayed, setPopupDisplayed] = useState(false);

  const [results, setResults] = useState<Subreddit[]>([]);

  useEffect(() => {
    setIsLoading(httpClient.isLoading);
  }, [httpClient.isLoading]);

  const updateSearchResults = async (searchQuery: string) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits?page=0&numResults=7&query=${searchQuery}`;
      const searchResults = await httpClient.sendRequest(url, "GET");
      const searchResultsFormatted = searchResults.results.map(
        (result: { [key: string]: any }) => {
          return new Subreddit(
            result.name,
            result.id,
            result.num_members,
            result.description
          );
        }
      );

      setResults(searchResultsFormatted);
    } catch (error) {}
  };

  const handleSearchQuery = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleConfirmSearch = () => {
    console.log("Search...");
    history.push(`search?query=${searchQuery}`);
    setPopupDisplayed(false);
  };

  const handleChooseItem = (subId: string) => {
    console.log("Search...");
    history.push(`sub/${subId}`);
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
