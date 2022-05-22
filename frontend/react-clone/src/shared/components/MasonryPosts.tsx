import { Post } from "../../models/Post";
import FeedItem from "./FeedItem";

import Masonry from "@mui/lab/Masonry";

import { useWindowDimensions } from "../hooks/use-window-dimensions";
import { useEffect, useState } from "react";

const MasonryPosts: React.FC<{ posts: Post[] }> = (props) => {
  const windowDimensions = useWindowDimensions();
  const [columns, setNumColumns] = useState(1);

  const handleUpdateColCount = () => {
    if (windowDimensions.width < 640) {
      setNumColumns(1);
    } else {
      setNumColumns(Math.floor(windowDimensions.width / 500));
    }
  };

  useEffect(() => {
    handleUpdateColCount();
  }, [windowDimensions]);

  return (
    <Masonry columns={columns} spacing={0}>
      {props.posts.map((post) => (
        <FeedItem
          key={`post-${post.id}`}
          post={post}
          handleUpdateLayout={() => {}}
        />
      ))}
    </Masonry>
  );
};
export default MasonryPosts;