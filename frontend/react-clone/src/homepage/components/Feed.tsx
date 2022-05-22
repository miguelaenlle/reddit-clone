import React, { useCallback, useEffect, useRef, useState } from "react";
import StackGrid from "react-stack-grid";
import { useHttpClient } from "../../hooks/http-hook";
import { Post } from "../../models/Post";
import Dropdown from "../../shared/components/Dropdown";
import FeedItem from "../../shared/components/FeedItem";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../constants/sort-modes";
import NewCommunityButton from "./NewCommunityButton";
import NewPostButton from "./NewPostButton";
import MasonryPosts from "../../shared/components/MasonryPosts";

const MAX_RESULTS_PER_PAGE = 25;

const Feed: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [maxReached, setMaxReached] = useState(false);
  const [hitBottom, setHitBottom] = useState(false);
  const [stackGrid, setStackGrid] = useState<StackGrid | null>();

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
    setPage(0);
  }, []);

  useEffect(() => {
    pullData(true);
  }, [page]);

  useEffect(() => {
    pullData(false);
  }, [selectedOption]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const updateGridLayout = () => {
    if (stackGrid) {
      stackGrid.updateLayout();
    }
  };

  return (
    <div className="pt-20 px-5" ref={listInnerRef}>
      <div className="relative z-10 md:flex xs:space-y-1 md:space-x-2 px-1.5">
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
        <div className={`z-0 w-full`}>
          <MasonryPosts posts={posts} />
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
  );
};
export default Feed;
