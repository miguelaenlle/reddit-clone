import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUsersClient } from "../../hooks/user-hook";
import SubredditResultLoader from "./SubredditResultLoader";
import UserResult from "./UserResult";

const NUM_RESULTS_PER_PAGE = 25;

const UserResults: React.FC<{}> = (props) => {
  const usersClient = useUsersClient(undefined, NUM_RESULTS_PER_PAGE);
  const location = useLocation();

  const updateQuery = () => {
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");
    if (query) {
      usersClient.updateQuery(query);
    }
  };

  useEffect(() => {
    updateQuery();
  }, [location.search]);

  return (
    <div className="space-y-5">
      {usersClient.users.map((result) => {
        return (
          <UserResult
            key={`user-result-${result.userId}-${Math.random().toString()}`}
            username={result.username}
            userId={result.userId}
            upvotes={result.upvotes}
          />
        );
      })}
      {usersClient.users.length === 0 && !usersClient.httpIsLoading && (
        <h1 className="text-zinc-400 text-xl">No results found.</h1>
      )}
      {NUM_RESULTS_PER_PAGE * (usersClient.page + 1) ===
        usersClient.users.length && (
        <p
          onClick={usersClient.expandResults}
          className=" text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
        >
          Load more results
        </p>
      )}

      {usersClient.httpIsLoading && <SubredditResultLoader />}
    </div>
  );
};
export default React.memo(UserResults);
