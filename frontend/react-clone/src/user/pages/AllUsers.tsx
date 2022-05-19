import { useEffect } from "react";
import { useUsersClient } from "../../hooks/user-hook";
import SubredditResultLoader from "../../search/components/SubredditResultLoader";
import UserResult from "../../search/components/UserResult";

const NUM_RESULTS_PER_PAGE = 25;

const AllUsers: React.FC<{}> = (props) => {
  const usersClient = useUsersClient(false, null, NUM_RESULTS_PER_PAGE);
  return (
    <div className="pt-28 px-5 bg-zinc-900 min-h-screen">
      <div className="space-y-5 animate-fade">
        <h1 className="text-zinc-200">All Users</h1>
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
    </div>
  );
};
export default AllUsers;
