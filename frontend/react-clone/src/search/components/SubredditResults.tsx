import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import SubredditResult from "./SubredditResult";
import SubredditResultLoader from "./SubredditResultLoader";

const SubredditResults: React.FC<{}> = (props) => {
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<{ [key: string]: any }[]>([]);
  const [resultsExpandable, setResultsExpandable] = useState(true);

  const location = useLocation();
  const resultsPerPage = 25;
  const httpClient = useHttpClient();

  const pullResults = async () => {
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");
    const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits?query=${query}&page=0&numResults=${resultsPerPage}`;
    const searchResults = await httpClient.sendRequest(url, "GET");
    console.log(searchResults);
    setResults(searchResults.results);
  };

  const expandResults = async () => {
    const newPage = page + 1;
    setPage(newPage);
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");
    const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits?query=${query}&page=${newPage}&numResults=${resultsPerPage}`;
    const searchResults = await httpClient.sendRequest(url, "GET");
    if (searchResults.length === resultsPerPage) {
      setResultsExpandable(true);
    }
    setResults((prevResults) => [...prevResults, ...searchResults.results]);

    console.log(searchResults);
  };

  useEffect(() => {
    setPage(0);
    setResults([]);
    setResultsExpandable(true);

    pullResults();
  }, [location.search]);

  return (
    <div className="space-y-5">
      {results.map((result) => {
        return (
          <SubredditResult
            key={result.id}
            subName={result.name}
            subId={result.id}
            members={result.num_members}
            description={result.description}
          />
        );
      })}
      {results.length === 0 && !httpClient.isLoading && (
        <h1 className="text-zinc-400 text-xl">No results found.</h1>
      )}
      {resultsPerPage * (page + 1) === results.length &&
        resultsExpandable &&
        !httpClient.isLoading && (
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