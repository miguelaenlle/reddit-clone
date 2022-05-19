import { Subreddit } from "../../models/Subreddit";
import SubredditResult from "../../search/components/SubredditResult";
import SubredditResultLoader from "../../search/components/SubredditResultLoader";
import { useSubredditMembership } from "../hooks/use-subreddit-membership";

const SubredditsList: React.FC<{
  subreddits: Subreddit[];
  httpIsLoading: boolean;
  page: number;
  resultsPerPage: number;
  expandSubreddits: () => void;
}> = (props) => {
  
  const subMembership = useSubredditMembership();

  return (
    <div className="space-y-3">
      {props.subreddits.map((result) => {
        return (
          <SubredditResult
            key={`sub-result-${result.subId}-${Math.random().toString()}`}
            subName={result.subName}
            subId={result.subId}
            members={result.members}
            description={result.description}
            isMember={subMembership.subreddits.includes(result.subId)}
            subredditLoading={subMembership.subredditsLoading.includes(
              result.subId
            )}
            joinSubreddit={() => subMembership.joinSubreddit(result.subId)}
            leaveSubreddit={() => subMembership.leaveSubreddit(result.subId)}
          />
        );
      })}
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
