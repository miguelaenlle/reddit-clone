import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUsersClient } from "../../hooks/user-hook";
import UserSearchResults from "../../user/components/UserSearchResults";
import SubredditResultLoader from "./SubredditResultLoader";
import UserResult from "./UserResult";

const NUM_RESULTS_PER_PAGE = 25;

const UserResults: React.FC<{}> = (props) => {
  const usersClient = useUsersClient(true, null, NUM_RESULTS_PER_PAGE);
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
      <UserSearchResults
        users={usersClient.users}
        httpIsLoading={usersClient.httpIsLoading}
        page={usersClient.page}
        expandResults={usersClient.expandResults}
      />
    </div>
  );
};
export default React.memo(UserResults);
