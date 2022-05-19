import { useEffect, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import PostResults from "../components/PostResults";
import SearchTypeSelector from "../components/SearchTypeSelector";
import SubredditResults from "../components/SubredditResults";
import UserResults from "../components/UserResults";
import { optionIds, optionValues } from "../constants/search-values";

const Search: React.FC<{}> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [resultsMode, setResultsMode] = useState("subreddits");
  const handleSelectOption = (optionId: string) => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const searchQuery = queryParams.get("query");
      history.push(`/search/${optionId}?query=${searchQuery}`);
      setResultsMode(optionId);
    } catch {}
  };

  const initializeOption = () => {
    try {
      const pathname = location.pathname;
      for (const term of ["subreddits", "users", "posts"]) {
        if (pathname.includes(term)) {
          setResultsMode(term);
          return;
        }
      }
    } catch {}
  };

  useEffect(() => {
    initializeOption();
  }, []);

  return (
    <div className="pt-28 px-10 bg-zinc-900 min-h-screen">
      <SearchTypeSelector
        selectedOptionId={resultsMode}
        handleSelectOption={handleSelectOption}
        optionIds={optionIds}
        optionValues={optionValues}
      />
      <Route exact path="/search/subreddits">
        <SubredditResults />
      </Route>
      <Route exact path="/search/users">
        <UserResults />
      </Route>
      <Route exact path="/search/posts">
        <PostResults />
      </Route>
    </div>
  );
};
export default Search;
