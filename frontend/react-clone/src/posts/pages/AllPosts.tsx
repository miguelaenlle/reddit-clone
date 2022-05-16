import { useState } from "react";

// import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";
import FeedItem from "../../shared/components/FeedItem";
import Dropdown from "../../shared/components/Dropdown";
import {
  optionIds,
  sortOptionValues,
  sortOptionIcons,
} from "../../homepage/constants/sort-modes";
import { usePostsClient } from "../../hooks/post-hook";
import PostCollection from "../components/PostCollection";

const NUM_RESULTS_PER_PAGE = 25;

const AllPosts: React.FC<{}> = (props) => {
  const postsClient = usePostsClient(
    false,
    undefined,
    undefined,
    undefined,
    NUM_RESULTS_PER_PAGE
  );

  return (
    <div className="pt-28 px-5 bg-zinc-900 min-h-screen">
      <div className="px-1.5 pb-5 z-10 animate-fade relative">
        <Dropdown
          navbar={false}
          optionIds={optionIds}
          optionValues={sortOptionValues}
          optionIcons={sortOptionIcons}
          selectedOption={postsClient.selectedOption}
          handleSelectedOption={postsClient.handleSelectedOption}
        />
      </div>

      <PostCollection
        posts={postsClient.posts}
        isLoading={postsClient.isLoading}
        httpIsLoading={postsClient.httpIsLoading}
        numResultsPerPage={NUM_RESULTS_PER_PAGE}
        page={postsClient.page}
        expandResults={postsClient.expandResults}
      />
    </div>
  );
};
export default AllPosts;
