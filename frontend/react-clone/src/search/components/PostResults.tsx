import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";

import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import FeedItem from "../../shared/components/FeedItem";

import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";

import Dropdown from "../../shared/components/Dropdown";
import FeedItemLoader from "../../shared/components/FeedItemLoader";

const PostResults: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");

  const [page, setPage] = useState(0);
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const resultsPerPage = 25;
  const httpClient = useHttpClient();

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  const pullPostData = async (pageNumber: number, sortMode: string) => {
    const searchQuery = location.search;
    const searchParams = new URLSearchParams(searchQuery);
    const query = searchParams.get("query");
    const url = `${process.env.REACT_APP_BACKEND_URL}/posts?query=${query}&page=${pageNumber}&numResults=${resultsPerPage}&sortMode=${sortMode}`;
    const searchResults = await httpClient.sendRequest(url, "GET");
    const searchResultsFormatted = searchResults.posts.map(
      (post: { [key: string]: any }) => {
        return new Post(
          post.id,
          post.title,
          post.text,
          post.sub_id.name, // add sub id
          post.sub_id._id,
          post.user_id.username, // add OP name
          post.user_id._id,
          post.post_time,
          post.num_upvotes,
          post.num_comments
        );
      }
    );
    return searchResultsFormatted;
  };

  const updatePostData = async () => {
    try {
      const searchResults = await pullPostData(page, selectedOption);
      setResults(searchResults);
    } catch (error) {
      console.log(error);
    }
  };

  const expandResults = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    console.log(newPage);
    setPage(newPage);
    try {
      const additionalSearchResults = await pullPostData(
        newPage,
        selectedOption
      );
      setResults((prevResults) => [...prevResults, ...additionalSearchResults]);
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

      {resultsPerPage * (page + 1) === results.length && !isLoading && (
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
