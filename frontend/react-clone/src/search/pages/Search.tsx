import { useState } from "react";
import PostResults from "../components/PostResults";
import SearchTypeSelector from "../components/SearchTypeSelector";
import SubredditResults from "../components/SubredditResults";
import UserResults from "../components/UserResults";
import { optionIds, optionValues } from "../constants/search-values";

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
          <UserResults />
        </div>
      )}
      {resultsMode === "posts" && <PostResults />}
    </div>
  );
};
export default Search;
