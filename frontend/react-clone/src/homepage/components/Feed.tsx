import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
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

const Feed: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const [posts, setPosts] = useState<Post[]>([]);

  const httpClient = useHttpClient();
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  const initializeData = useCallback(async () => {
    const url = `${
      process.env.REACT_APP_BACKEND_URL
    }/feed?sortMode=${selectedOption}&page=${0}&numResults=${10}`;
    const data = await httpClient.sendRequest(url, "GET");
    console.log(url);
    console.log(data);
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
          post.num_comments
        )
    );
    setPosts(formattedPosts);
  }, [selectedOption]);

  useEffect(() => {
    initializeData();
  }, [selectedOption]);

  return (
    <React.Fragment>
      <div className="pt-20 px-5">
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
        <div className="z-0 animate-fade relative">
          <div
            className={`${
              httpClient.isLoading ? "blur-sm" : ""
            } z-1 animate-fade flex flex-wrap`}
          >
            {posts.map((post) => (
              <FeedItem key={`post-${post.id}`} post={post} />
            ))}
          </div>
        </div>
      </div>
      <Route exact path="/home/post/:postId">
        <PostPage />
      </Route>
    </React.Fragment>
  );
};
export default Feed;
