import { useEffect, useState, useCallback } from "react";
import Dropdown from "../../shared/components/Dropdown";
import NewPostButton from "./NewPostButton";
import NewCommunityButton from "./NewCommunityButton";
import { useHttpClient } from "../../hooks/http-hook";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../constants/sort-modes";
import FeedItem from "../../shared/components/FeedItem";

import { Post } from "../../models/Post";

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
    const formattedPosts = data.posts.map(
      (post: { [key: string]: any }) =>
        new Post(
          post.id,
          post.title,
          post.sub_id.name, // add sub id
          post.user_id.username, // add OP name
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
            <FeedItem
              key={post.id}
              postId={post.id}
              title={post.title}
              subName={post.subName}
              opName={post.opName}
              initialUpvotes={post.initialUpvotes}
              numComments={post.numComments}
              date={post.postDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Feed;
