import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import SubredditResult from "./SubredditResult";
import SubredditResultLoader from "./SubredditResultLoader";
import UserResult from "./UserResult";
import React from "react";
import { User } from "../../models/User";

const UserResults: React.FC<{}> = (props) => {
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<User[]>([]);

  const location = useLocation();
  const resultsPerPage = 25;
  const httpClient = useHttpClient();

  const pullResultData = async (pageNumber: number) => {
    try {
      const searchQuery = location.search;
      const searchParams = new URLSearchParams(searchQuery);
      const query = searchParams.get("query");
      const url = `${process.env.REACT_APP_BACKEND_URL}/users?searchQuery=${query}&page=${pageNumber}&numResults=${resultsPerPage}`;
      const searchResults = await httpClient.sendRequest(url, "GET");
      const searchResultsFormatted = searchResults.data.map(
        (result: { [key: string]: any }) => {
          return new User(result.id, result.username, result.num_upvotes);
        }
      );
      return searchResultsFormatted;
    } catch (error) {}
  };

  const pullResults = async () => {
    try {
      const searchResults = await pullResultData(0);
      setResults(searchResults);
    } catch (error) {
    }
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
          <UserResult
            key={`user-result-${result.userId}-${Math.random().toString()}`}
            username={result.username}
            userId={result.userId}
            upvotes={result.upvotes}
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
export default React.memo(UserResults);
