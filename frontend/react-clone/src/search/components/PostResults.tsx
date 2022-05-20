import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";
import { usePostsClient } from "../../hooks/post-hook";
import PostCollection from "../../posts/components/PostCollection";
import Dropdown from "../../shared/components/Dropdown";

const RESULTS_PER_PAGE = 25;

const PostResults: React.FC<{}> = (props) => {
  const location = useLocation();

  const postClient = usePostsClient(
    true,
    "",
    undefined,
    undefined,
    RESULTS_PER_PAGE
  );

  const updateQuery = () => {
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");
    if (query) {
      postClient.updateQuery(query);
    }
  };

  useEffect(() => {
    updateQuery();
  }, [location.search]);

  return (
    <div className="z-0 animate-fade relative">
      <div className="z-10 py-1 pb-10 relative">
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
        query={postClient.query}
        hitLimit={postClient.hitLimit}
        atBottom={postClient.atBottom}
        posts={postClient.posts}
        isLoading={postClient.httpIsLoading}
        httpIsLoading={postClient.httpIsLoading}
        numResultsPerPage={RESULTS_PER_PAGE}
        page={postClient.page}
        expandResults={postClient.expandResults}
        handleHitBottom={postClient.handleHitBottom}
      />
    </div>
  );
};
export default PostResults;
