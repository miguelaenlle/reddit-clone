import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import NewPostButton from "../../homepage/components/NewPostButton";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";
import { usePostsClient } from "../../hooks/post-hook";
import PostCollection from "../../posts/components/PostCollection";
import Dropdown from "../../shared/components/Dropdown";
import FeedItem from "../../shared/components/FeedItem";
import FeedItemLoader from "../../shared/components/FeedItemLoader";
import SubredditHeader from "../components/SubredditHeader";

const RESULTS_PER_PAGE = 25;

const Subreddit: React.FC<{}> = (props) => {
  const params = useParams<{ subId: string }>();
  const postClient = usePostsClient(
    undefined,
    undefined,
    params.subId,
    RESULTS_PER_PAGE
  );
  const location = useLocation();

  useEffect(() => {
    postClient.updateQuery(location.search);
  }, [location.search]);

  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <SubredditHeader subId={params.subId} />
      <div className="p-5">
        <div className="z-10 flex space-x-2 relative">
          <Dropdown
            navbar={false}
            optionIds={optionIds}
            optionValues={sortOptionValues}
            optionIcons={sortOptionIcons}
            selectedOption={postClient.selectedOption}
            handleSelectedOption={postClient.handleSelectedOption}
          />
          <NewPostButton />
        </div>

        <PostCollection
          posts={postClient.posts}
          isLoading={postClient.httpIsLoading}
          httpIsLoading={postClient.httpIsLoading}
          numResultsPerPage={RESULTS_PER_PAGE}
          page={postClient.page}
          expandResults={postClient.expandResults}
        />
      </div>
    </div>
  );
};
export default Subreddit;
