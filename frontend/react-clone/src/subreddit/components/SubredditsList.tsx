import { useMemo } from "react";
import { Subreddit } from "../../models/Subreddit";
import SubredditResult from "../../search/components/SubredditResult";
import SubredditResultLoader from "../../search/components/SubredditResultLoader";
import { useSubredditMembership } from "../hooks/use-subreddit-membership";
import SubredditResultsList from "./SubredditResultsList";

const SubredditsList: React.FC<{
  subreddits: Subreddit[];
  httpIsLoading: boolean;
  page: number;
  resultsPerPage: number;
  expandSubreddits: () => void;
}> = (props) => {
  const resultsList = useMemo(() => (
    <SubredditResultsList subreddits={props.subreddits} />
  ), [props.subreddits]);
  return (
    <div className="space-y-3">
      {resultsList}
      {props.subreddits.length === 0 && !props.httpIsLoading && (
        <h1 className="text-zinc-400 text-xl">No results found.</h1>
      )}
      {props.resultsPerPage * (props.page + 1) === props.subreddits.length && (
        <p
          onClick={props.expandSubreddits}
          className=" text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
        >
          Load more results
        </p>
      )}

      {props.httpIsLoading && <SubredditResultLoader />}
    </div>
  );
};
export default SubredditsList;
