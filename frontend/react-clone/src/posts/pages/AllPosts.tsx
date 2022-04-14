import { useState } from "react";

import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";
import FeedItem from "../../shared/components/FeedItem";
import Dropdown from "../../shared/components/Dropdown";
import {
  optionIds,
  sortOptionValues,
  sortOptionIcons,
} from "../../homepage/constants/sort-modes";

const AllPosts: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="pt-28 px-5 bg-zinc-900 min-h-screen">
      <div className="px-1.5 pb-5 z-10 animate-fade relative">
        <Dropdown
          navbar={false}
          optionIds={optionIds}
          optionValues={sortOptionValues}
          optionIcons={sortOptionIcons}
          selectedOption={selectedOption}
          handleSelectedOption={handleSelectedOption}
        />
      </div>

      <div className={`z-0 animate-fade flex flex-wrap`}>
        {DUMMY_POSTS.map((post) => (
          <FeedItem
            key={post.id}
            postId={`${post.id}`}
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
  );
};
export default AllPosts;
