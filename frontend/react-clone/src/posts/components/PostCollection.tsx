import React, { useEffect, useState } from "react";
import StackGrid from "react-stack-grid";
import { Post } from "../../models/Post";
import FeedItem from "../../shared/components/FeedItem";
import FeedItemLoader from "../../shared/components/FeedItemLoader";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import Masonry from "@mui/lab/Masonry";
import MasonryPosts from "../../shared/components/MasonryPosts";

const PostCollection: React.FC<{
  query: string | undefined;
  hitLimit: boolean;
  atBottom: boolean;
  posts: Post[];
  isLoading: boolean;
  httpIsLoading: boolean;
  numResultsPerPage: number;
  page: number;
  expandResults: () => void;
  handleHitBottom: () => void;
}> = (props) => {
  const handleScroll = () => {
    if (!props.hitLimit) {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;
      if (!props.atBottom && bottomOfWindow) {
        props.handleHitBottom();
      } else {
        return;
      }
      props.expandResults();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [props.query, props.page, props.atBottom, props.hitLimit]);

  const [stackGrid, setStackGrid] = useState<StackGrid | null>();

  const updateGridLayout = () => {
    if (stackGrid) {
      stackGrid.updateLayout();
    }
  };

  useEffect(() => {
    updateGridLayout();
  }, [props.posts]);

  return (
    <React.Fragment>
      <div className="-mx-1.5 pt-4 z-0 animate-fade relative pb-24">
        {!props.httpIsLoading && props.posts.length === 0 && (
          <p className="text-zinc-400">
            No posts yet. Be the first one to post!
          </p>
        )}
        <MasonryPosts posts={props.posts} />
      </div>
      {props.numResultsPerPage * (props.page + 1) === props.posts.length &&
        !props.isLoading &&
        !props.atBottom && (
          <p
            onClick={() => {
              props.expandResults();
            }}
            className="my-5 text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
          >
            Load more results
          </p>
        )}
      {props.isLoading && (
        <div className="flex p-2 items-center">
          <LoadingSpinner />
          <p className="text-zinc-200">Loading...</p>
        </div>
      )}
    </React.Fragment>
  );
};
export default PostCollection;
