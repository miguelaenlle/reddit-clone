import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import SubredditResult from "../../search/components/SubredditResult";
import SubredditResultLoader from "../../search/components/SubredditResultLoader";
import { useSubredditMembership } from "../../subreddit/hooks/use-subreddit-membership";

const UserSubreddits: React.FC<{ userId: string }> = (props) => {
  const subMembership = useSubredditMembership();
  const httpClient = useHttpClient();
  const [userSubreddits, setUserSubreddits] = useState<Subreddit[]>([]);
  const initializeUserSubreddits = async () => {
    try {
      const subreddits = await httpClient.fetchUserSubreddits(props.userId);
      if (subreddits) {
        setUserSubreddits(subreddits);
      }
    } catch (error) {}
  };
  useEffect(() => {
    initializeUserSubreddits();
  }, []);

  return (
    <div className="space-y-3">
      {userSubreddits.map((result) => {
        return (
          <SubredditResult
            key={`sub-result-${result.subId}-${Math.random().toString()}`}
            subName={result.subName}
            subId={result.subId}
            members={result.members}
            description={result.description}
            isMember={subMembership.subreddits.includes(result.subId)}
            subredditLoading={subMembership.subredditsLoading.includes(result.subId)}
            joinSubreddit={() => subMembership.joinSubreddit(result.subId)}
            leaveSubreddit={() => subMembership.leaveSubreddit(result.subId)}
          />
        );
      })}
      {userSubreddits.length === 0 && !httpClient.isLoading && (
        <h1 className="text-zinc-400 text-xl">No results found.</h1>
      )}

      {httpClient.isLoading && <SubredditResultLoader />}
    </div>
  );
};
export default UserSubreddits;
