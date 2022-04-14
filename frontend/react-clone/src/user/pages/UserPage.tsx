import { useState } from "react";
import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues
} from "../../homepage/constants/sort-modes";
import Dropdown from "../../shared/components/Dropdown";
import FeedItem from "../../shared/components/FeedItem";
import UserHeader from "../components/UserHeader";

const User: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };
  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <UserHeader />
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
        </div>

        <div className="pt-10 z-0 animate-fade relative">
          <div className={`z-1 animate-fade flex flex-wrap`}>
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
      </div>
    </div>
  );
};
export default User;
