import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import SubredditResult from "./SubredditResult";
import SubredditResultLoader from "./SubredditResultLoader";
import UserResult from "./UserResult";
import React from "react";

const UserResults: React.FC<{}> = (props) => {
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
    const url = `${process.env.REACT_APP_BACKEND_URL}/users?searchQuery=${query}&page=0&numResults=${resultsPerPage}`;
    const searchResults = await httpClient.sendRequest(url, "GET");
    console.log(searchResults);
    setResults(searchResults.data);
  };

  const expandResults = async () => {
    const newPage = page + 1;
    setPage(newPage);
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");
    const url = `${process.env.REACT_APP_BACKEND_URL}/users?searchQuery=${query}&page=${newPage}&numResults=${resultsPerPage}`;
    const searchResults = await httpClient.sendRequest(url, "GET");
    console.log(searchResults);
    if (searchResults.length === resultsPerPage) {
      setResultsExpandable(true);
    }
    setResults((prevResults) => [...prevResults, ...searchResults.data]);

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
          <UserResult
            key={result.id}
            username={result.username}
            userId={result.id}
            upvotes={result.num_upvotes}
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
export default React.memo(UserResults);
