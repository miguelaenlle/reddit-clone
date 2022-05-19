import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Post } from "../../models/Post";
import FeedItem from "../../shared/components/FeedItem";
import FeedItemLoader from "../../shared/components/FeedItemLoader";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

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
      if (!props.isLoading) {
        if (bottomOfWindow && !props.isLoading) {
          if (props.query) {
            props.expandResults();
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [props.query, props.page, props.atBottom, props.hitLimit]);

  return (
    <React.Fragment>
      <div className="-mx-1.5 pt-4 z-0 animate-fade relative">
        {!props.httpIsLoading && props.posts.length === 0 && (
          <p className="text-zinc-200 text-xl">
            No posts yet. Be the first one to post!
          </p>
        )}
        <div className={`z-1 animate-fade flex flex-wrap`}>
          {props.posts.map((post) => (
            <FeedItem key={`post-${post.id}`} post={post} />
          ))}
          {props.httpIsLoading && (
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
      {props.numResultsPerPage * (props.page + 1) === props.posts.length &&
        !props.isLoading &&
        !props.atBottom && (
          <p
            onClick={() => {
              console.log(props.query);
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
