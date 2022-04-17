import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NewPostButton from "../../homepage/components/NewPostButton";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import Dropdown from "../../shared/components/Dropdown";
import FeedItem from "../../shared/components/FeedItem";
import FeedItemLoader from "../../shared/components/FeedItemLoader";
import SubredditHeader from "../components/SubredditHeader";

const RESULTS_PER_PAGE = 50;

const Subreddit: React.FC<{}> = (props) => {
  const params = useParams<{ subId: string }>();
  const httpClient = useHttpClient();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("top");

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  const fetchPosts = async (
    pageNumber: number,
    selectedOption: string
  ): Promise<Post[] | null> => {
    const formattedPosts: Post[] | null = await httpClient.fetchPosts(
      pageNumber,
      selectedOption,
      RESULTS_PER_PAGE,
      params.subId
    );
    return formattedPosts;
  };

  const initializePosts = async () => {
    const posts = await fetchPosts(0, "top");
    if (posts) {
      setPosts(posts);
    }
  };

  const expandResults = async () => {
    setIsLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    try {
      const additionalSearchResults = await fetchPosts(newPage, selectedOption);
      if (additionalSearchResults) {
        setPosts((prevResults) => [...prevResults, ...additionalSearchResults]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangedOption = async (newOption: string) => {
    const posts = await fetchPosts(page, newOption);
    if (posts) {
      setPosts(posts);
    }
  };

  useEffect(() => {
    setPage(0);
    setPosts([]);
    initializePosts();
  }, [location.pathname]);

  useEffect(() => {
    handleChangedOption(selectedOption);
  }, [selectedOption]);

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
            selectedOption={selectedOption}
            handleSelectedOption={handleSelectedOption}
          />
          <NewPostButton />
        </div>

        <div className="pt-10 z-0 animate-fade relative">
          <div className={`z-1 animate-fade flex flex-wrap`}>
            {posts.map((post) => (
              <FeedItem key={`post-${post.id}`} post={post} />
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
        </div>
        {RESULTS_PER_PAGE * (page + 1) === posts.length && !isLoading && (
          <p
            onClick={expandResults}
            className="my-5 text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
          >
            Load more results
          </p>
        )}
      </div>
    </div>
  );
};
export default Subreddit;
