import { useEffect, useState } from "react";
import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";
import Dropdown from "../../shared/components/Dropdown";
import { useLocation, useParams } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";

import FeedItem from "../../shared/components/FeedItem";
import UserHeader from "../components/UserHeader";
import { Post } from "../../models/Post";
import { usePostsClient } from "../../hooks/post-hook";
import PostCollection from "../../posts/components/PostCollection";

const RESULTS_PER_PAGE = 25;
const User: React.FC<{}> = (props) => {
  const params = useParams<{ userId: string }>();
  const postClient = usePostsClient(
    undefined,
    params.userId,
    undefined,
    RESULTS_PER_PAGE
  );
  useEffect(() => {
    postClient.updateUserId(params.userId);
  }, [params.userId]);

  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <UserHeader />
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
export default User;
