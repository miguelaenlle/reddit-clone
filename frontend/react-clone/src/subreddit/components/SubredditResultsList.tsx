import React, { useEffect } from "react";
import { Subreddit } from "../../models/Subreddit";
import SubredditResult from "../../search/components/SubredditResult";
import { useSubredditMembership } from "../hooks/use-subreddit-membership";

const SubredditResultsList: React.FC<{ subreddits: Subreddit[] }> = (props) => {
  const subMembership = useSubredditMembership();
  return (
    <React.Fragment>
      {props.subreddits.map((result) => {
        return (
          <SubredditResult
            key={`sub-result-${result.subId}-${Math.random().toString()}`}
            iconURL={result.iconUrl}
            subName={result.subName}
            subId={result.subId}
            members={result.members}
            description={result.description}
            isMember={subMembership.subreddits.includes(result.subId)}
            subredditLoading={subMembership.subredditsLoading.includes(
              result.subId
            )}
          />
        );
      })}
    </React.Fragment>
  );
};
export default SubredditResultsList;
