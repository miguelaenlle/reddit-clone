import { User } from "../../models/User";
import SubredditResultLoader from "../../search/components/SubredditResultLoader";
import UserResult from "../../search/components/UserResult";

const NUM_RESULTS_PER_PAGE = 25;

const UserSearchResults: React.FC<{
  users: User[];
  httpIsLoading: boolean;
  page: number;
  expandResults: () => void;
}> = (props) => {
  return (
    <div className="space-y-5">
      {props.users.map((result) => {
        return (
          <UserResult
            key={`user-result-${result.userId}-${Math.random().toString()}`}
            username={result.username}
            userId={result.userId}
            upvotes={result.upvotes}
          />
        );
      })}
      {props.users.length === 0 && !props.httpIsLoading && (
        <h1 className="text-zinc-400 text-xl">No results found.</h1>
      )}
      {NUM_RESULTS_PER_PAGE * (props.page + 1) === props.users.length && (
        <p
          onClick={props.expandResults}
          className=" text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
        >
          Load more results
        </p>
      )}

      {props.httpIsLoading && <SubredditResultLoader />}
    </div>
  );
};
export default UserSearchResults;
