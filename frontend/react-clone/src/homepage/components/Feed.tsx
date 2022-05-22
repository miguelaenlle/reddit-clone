import React, { useCallback, useEffect, useState } from "react";
import { useRef } from "react";
import { Route, Switch } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import PostPage from "../../posts/pages/Post";
import Dropdown from "../../shared/components/Dropdown";
import FeedItem from "../../shared/components/FeedItem";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../constants/sort-modes";
import NewCommunityButton from "./NewCommunityButton";
import NewPostButton from "./NewPostButton";

const MAX_RESULTS_PER_PAGE = 25;

const Feed: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [maxReached, setMaxReached] = useState(false);
  const [hitBottom, setHitBottom] = useState(false);

  const httpClient = useHttpClient();
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  const pullData = useCallback(
    async (update: boolean) => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/feed?sortMode=${selectedOption}&page=${page}&numResults=${MAX_RESULTS_PER_PAGE}`;
      const data = await httpClient.sendRequest(url, "GET");
      const formattedPosts = data.posts.map(
        (post: { [key: string]: any }) =>
          new Post(
            post.id,
            post.title,
            post.text,
            post.sub_id.name, // add sub id
            post.sub_id._id,
            post.user_id.username, // add OP name
            post.user_id._id,
            post.post_time,
            post.num_upvotes,
            post.num_comments,
            post.deleted,
            post.image_ids
          )
      );

      if (update) {
        if (formattedPosts.length === 0) {
          setMaxReached(true);
        }
        setPosts((prevPosts) => [...prevPosts, ...formattedPosts]);
      } else {
        setPosts(formattedPosts);
      }
      setHitBottom(false);
    },
    [selectedOption, page]
  );

  const listInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(0);
  }, []);

  useEffect(() => {
    pullData(true);
  }, [page]);

  useEffect(() => {
    pullData(false);
  }, [selectedOption]);

  const handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;
    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
    if (bottomOfWindow && !maxReached) {
      setHitBottom(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="pt-20 px-5" ref={listInnerRef}>
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
          <NewCommunityButton />
        </div>
        <div className={`mx-1 my-6 animate-pulse h-2 bg-transparent`}></div>
        <div className="z-0 animate-fade relative ">
          <div className={`z-1  w-full`}>
            {posts.length > 0 && (
              <StackGrid columnWidth={300} gutterHeight={5} gutterWidth={0}>
                {posts.map((post) => (
                  <FeedItem key={`post-${post.id}`} post={post} />
                ))}
              </StackGrid>
            )}
          </div>

          {posts.length % MAX_RESULTS_PER_PAGE === 0 &&
            !httpClient.isLoading &&
            !maxReached && (
              <p
                className="text-zinc-400 p-2 hover:cursor-pointer"
                onClick={handleScroll}
              >
                Load more posts
              </p>
            )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Feed;
