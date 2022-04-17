import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import SubredditResult from "./SubredditResult";
import SubredditResultLoader from "./SubredditResultLoader";

import { Subreddit } from "../../models/Subreddit";

const SubredditResults: React.FC<{}> = (props) => {
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<Subreddit[]>([]);

  const location = useLocation();
  const resultsPerPage = 25;
  const httpClient = useHttpClient();

  const pullResultData = async (pageNumber: number) => {
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");

    const searchResultsFormatted = await httpClient.fetchSubreddits(
      query,
      pageNumber,
      resultsPerPage
    );
    return searchResultsFormatted;
  };

  const pullResults = async () => {
    try {
      const searchResults = await pullResultData(0);
      setResults(searchResults);
    } catch (error) {}
  };

  const expandResults = async () => {
    const newPage = page + 1;
    setPage(newPage);
    try {
      const additionalSearchResults = await pullResultData(newPage);
      setResults((prevResults) => [...prevResults, ...additionalSearchResults]);
    } catch (error) {}
  };

  useEffect(() => {
    setPage(0);
    setResults([]);

    pullResults();
  }, [location.search]);

  return (
    <div className="space-y-5">
      {results.map((result) => {
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
      {results.length === 0 && !httpClient.isLoading && (
        <h1 className="text-zinc-400 text-xl">No results found.</h1>
      )}
      {resultsPerPage * (page + 1) === results.length && (
        <p
          onClick={expandResults}
          className=" text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
        >
          Load more results
        </p>
      )}

      {httpClient.isLoading && <SubredditResultLoader />}
    </div>
  );
};
export default React.memo(SubredditResults);
