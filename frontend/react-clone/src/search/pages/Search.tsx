import { useState } from "react";
import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";
import { useHttpClient } from "../../hooks/http-hook";
import FeedItem from "../../shared/components/FeedItem";
import SearchTypeSelector from "../components/SearchTypeSelector";
import SubredditResults from "../components/SubredditResults";
import UserResult from "../components/UserResult";
import { optionIds, optionValues } from "../constants/search-values";

const resultsPerPage = 1;

const Search: React.FC<{}> = (props) => {
  const [resultsMode, setResultsMode] = useState("subreddits");
  const handleSelectOption = (optionId: string) => {
    setResultsMode(optionId);
  };

  return (
    <div className="pt-28 px-10 bg-zinc-900 min-h-screen">
      <SearchTypeSelector
        selectedOptionId={resultsMode}
        handleSelectOption={handleSelectOption}
        optionIds={optionIds}
        optionValues={optionValues}
      />
      {resultsMode === "subreddits" && (
        <div className="space-y-5 animate-fade">
          <SubredditResults />
        </div>
      )}
      {resultsMode === "users" && (
        <div className="space-y-5 animate-fade">
          <UserResult />
          <UserResult />
          <UserResult />
        </div>
      )}
      {resultsMode === "posts" && (
        <div className="z-0 animate-fade relative">
          <div className={`z-1 animate-fade flex flex-wrap`}>
            {DUMMY_POSTS.map((post) => (
              <FeedItem
                key={`dummy-feed-${Math.random().toString()}`}
                post={post}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Search;
