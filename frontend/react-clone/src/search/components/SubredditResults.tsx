import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSubredditsClient } from "../../hooks/subreddit-hook";
import { Subreddit } from "../../models/Subreddit";
import SubredditsList from "../../subreddit/components/SubredditsList";
import SubredditResult from "./SubredditResult";
import SubredditResultLoader from "./SubredditResultLoader";

const RESULTS_PER_PAGE = 25;

const SubredditResults: React.FC<{}> = (props) => {
  const location = useLocation();

  const subredditsClient = useSubredditsClient(undefined, RESULTS_PER_PAGE);

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
    <SubredditsList
      subreddits={subredditsClient.subreddits}
      httpIsLoading={subredditsClient.httpIsLoading}
      page={subredditsClient.page}
      resultsPerPage={RESULTS_PER_PAGE}
      expandSubreddits={subredditsClient.expandSubreddits}
    />
  );
};
export default React.memo(SubredditResults);
