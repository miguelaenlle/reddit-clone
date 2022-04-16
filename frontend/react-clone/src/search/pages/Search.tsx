import { useState } from "react";
import PostItem from "../../posts/components/PostItem";
import LightButton from "../../shared/components/LightButton";
import SearchTypeSelector from "../components/SearchTypeSelector";
import SubredditResult from "../components/SubredditResult";
import UserResult from "../components/UserResult";
import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";

import { optionIds, optionValues } from "../constants/search-values";
import FeedItem from "../../shared/components/FeedItem";

import { Switch } from "react-router-dom";

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
          <SubredditResult />
          <SubredditResult />
          <SubredditResult />
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
          <div
            className={`z-1 animate-fade flex flex-wrap`}
          >
            {DUMMY_POSTS.map((post) => (
              <FeedItem
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
