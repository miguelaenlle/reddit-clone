import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSubredditsClient } from "../../hooks/subreddit-hook";
import { Subreddit } from "../../models/Subreddit";
import SubredditResult from "./SubredditResult";
import SubredditResultLoader from "./SubredditResultLoader";

const RESULTS_PER_PAGE = 25;

const SubredditResults: React.FC<{}> = (props) => {
  const location = useLocation();

  const subredditsClient = useSubredditsClient(
    undefined,
    undefined,
    RESULTS_PER_PAGE
  );

  const updateQuery = () => {
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");
    if (query) {
      subredditsClient.updateQuery(query);
    }
  };

  useEffect(() => {
    updateQuery();
  }, [location.search]);

  return (
    <div className="space-y-5">
      {subredditsClient.subreddits.map((result) => {
        return (
          <SubredditResult
            key={`sub-result-${result.subId}-${Math.random().toString()}`}
            subName={result.subName}
            subId={result.subId}
            members={result.members}
            description={result.description}
          />
        );
      })}
      {subredditsClient.subreddits.length === 0 &&
        !subredditsClient.httpIsLoading && (
          <h1 className="text-zinc-400 text-xl">No results found.</h1>
        )}
      {RESULTS_PER_PAGE * (subredditsClient.page + 1) ===
        subredditsClient.subreddits.length && (
        <p
          onClick={subredditsClient.expandSubreddits}
          className=" text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
        >
          Load more results
        </p>
      )}

      {subredditsClient.httpIsLoading && <SubredditResultLoader />}
    </div>
  );
};
export default React.memo(SubredditResults);
