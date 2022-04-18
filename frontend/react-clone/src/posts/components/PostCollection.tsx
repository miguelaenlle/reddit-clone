import React from "react";
import { Post } from "../../models/Post";
import FeedItem from "../../shared/components/FeedItem";
import FeedItemLoader from "../../shared/components/FeedItemLoader";

const PostCollection: React.FC<{
  posts: Post[];
  isLoading: boolean;
  httpIsLoading: boolean;
  numResultsPerPage: number;
  page: number;
  expandResults: () => void;
}> = (props) => {
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
        !props.isLoading && (
          <p
            onClick={props.expandResults}
            className="my-5 text-zinc-400 hover:cursor-pointer hover:text-zinc-200"
          >
            Load more results
          </p>
        )}
    </React.Fragment>
  );
};
export default PostCollection;
