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
import SubredditHeader from "../components/SubredditHeader";

const NUM_RESULTS_PER_PAGE = 25;

const Subreddit: React.FC<{}> = (props) => {
  const params = useParams<{ subId: string }>();
  const postClient = usePostsClient(
    false,
    undefined,
    undefined,
    params.subId,
    NUM_RESULTS_PER_PAGE
  );
  const location = useLocation();

  useEffect(() => {
    postClient.updateQuery(location.search);
  }, [location.search, location.pathname]);

  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <SubredditHeader subId={params.subId} />
      <div className="p-5">
        <div className="z-10 md:flex xs:space-y-2 md:marker md:space-x-2 relative">
          <Dropdown
            navbar={false}
            optionIds={optionIds}
            optionValues={sortOptionValues}
            optionIcons={sortOptionIcons}
            selectedOption={postClient.selectedOption}
            handleSelectedOption={postClient.handleSelectedOption}
          />
          <NewPostButton initialSubId={params.subId} />
        </div>

        <PostCollection
          query={postClient.query}
          hitLimit={postClient.hitLimit}
          atBottom={postClient.atBottom}
          posts={postClient.posts}
          isLoading={postClient.httpIsLoading}
          httpIsLoading={postClient.httpIsLoading}
          numResultsPerPage={NUM_RESULTS_PER_PAGE}
          page={postClient.page}
          expandResults={postClient.expandResults}
          handleHitBottom={postClient.handleHitBottom}
        />
      </div>
    </div>
  );
};
export default Subreddit;
