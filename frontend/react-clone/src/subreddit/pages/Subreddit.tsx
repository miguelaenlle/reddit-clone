import { useState } from "react";
import NewPostButton from "../../homepage/components/NewPostButton";
import { DUMMY_POSTS } from "../../homepage/constants/dummy-posts";
import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../../homepage/constants/sort-modes";
import Dropdown from "../../shared/components/Dropdown";
import FeedItem from "../../shared/components/FeedItem";
import SubredditHeader from "../components/SubredditHeader";

const Subreddit: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };
  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <SubredditHeader />
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
          <NewPostButton />
        </div>

        <div className="pt-10 z-0 animate-fade relative">
          <div className={`z-1 animate-fade flex flex-wrap`}>
            {DUMMY_POSTS.map((post) => (
              <FeedItem post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Subreddit;
