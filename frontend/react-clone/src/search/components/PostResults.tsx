import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";

import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import FeedItem from "../../shared/components/FeedItem";
import { Route } from "react-router-dom";
import PostPage from "../../posts/pages/Post";

import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";

import Dropdown from "../../shared/components/Dropdown";
import FeedItemLoader from "../../shared/components/FeedItemLoader";
const RESULTS_PER_PAGE = 25;

const PostResults: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");

  const [page, setPage] = useState(0);
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const httpClient = useHttpClient();

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  const pullPostData = async (pageNumber: number, sortMode: string) => {
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");

    const formattedPosts: Post[] | null = await httpClient.fetchPosts(
      pageNumber,
      sortMode,
      RESULTS_PER_PAGE,
      undefined,
      query
    );

    return formattedPosts;
  };

  const updatePostData = async () => {
    try {
      const searchResults = await pullPostData(page, selectedOption);
      if (searchResults) {
        setResults(searchResults);
      }
    } catch (error) {}
  };

  const expandResults = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    try {
      const additionalSearchResults = await pullPostData(
        newPage,
        selectedOption
      );
      if (additionalSearchResults) {
        setResults((prevResults) => [
          ...prevResults,
          ...additionalSearchResults,
        ]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    updatePostData();
  }, [selectedOption]);

  useEffect(() => {
    setSelectedOption("top");
    setPage(0);
    setResults([]);
    updatePostData();
  }, [location.search]);

  return (
    <div className="z-0 animate-fade relative">
      <div className="z-10 py-1 pb-10 relative">
        <Dropdown
          navbar={false}
          optionIds={optionIds}
          optionValues={sortOptionValues}
          optionIcons={sortOptionIcons}
          selectedOption={selectedOption}
          handleSelectedOption={handleSelectedOption}
        />
      </div>
      <div className={`-ml-1.5 z-1 animate-fade flex flex-wrap`}>
        {results.map((post) => (
          <FeedItem
            key={`dummy-feed-${Math.random().toString()}`}
            post={post}
          />
        ))}
        {httpClient.isLoading && (
          <React.Fragment>
            {[...Array(5)].map(() => {
              return (
                <FeedItemLoader
                  key={`post-loader-${Math.random().toString()}`}
                />
              );
            })}
          </React.Fragment>
        )}
      </div>
      {results.length === 0 && (
        <h1 className="text-zinc-400 text-xl">No results found.</h1>
      )}

      {RESULTS_PER_PAGE * (page + 1) === results.length && !isLoading && (
        <p
          onClick={expandResults}
          className="my-5 text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
        >
          Load more results
        </p>
      )}
    </div>
  );
};
export default React.memo(PostResults);
