import { useState } from "react";
import Dropdown from "../../shared/components/Dropdown";
import NewPostButton from "./NewPostButton";
import NewCommunityButton from "./NewCommunityButton";

import {
  optionIds,
  sortOptionIcons,
  sortOptionValues,
} from "../constants/sort-modes";
import FeedItem from "../../shared/components/FeedItem";

const DUMMY_POSTS: {
  id: number;
  title: string;
  subName: string;
  opName: string;
  initialUpvotes: number;
  numComments: number;
}[] = [
  {
    id: 1,
    title: "How to make a react app continued",
    subName: "react",
    opName: "nexus",
    initialUpvotes: 0,
    numComments: 0,
  },
  {
    id: 2,
    title: "The best PC setup of 2022",
    subName: "pcmasterrace",
    opName: "test123",
    initialUpvotes: 500,
    numComments: 5,
  },
  {
    id: 3,
    title: "My $2000 pc setup",
    subName: "battlestations",
    opName: "johndoe",
    initialUpvotes: 0,
    numComments: 3,
  },
  {
    id: 4,
    title: "How to retire at 15",
    subName: "fatfire",
    opName: "janedoe123",
    initialUpvotes: 15,
    numComments: 22,
  },
];

const Feed: React.FC<{}> = (props) => {
  const [selectedOption, setSelectedOption] = useState("top");
  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="pt-20 px-5">
      <div className="flex space-x-2">
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
      <div className="pt-6 flex flex-wrap">
        {DUMMY_POSTS.map((post) => (
          <FeedItem
            key={post.id}
            title={post.title}
            subName={post.subName}
            opName={post.opName}
            initialUpvotes={post.initialUpvotes}
            numComments={post.numComments}
          />
        ))}
      </div>
    </div>
  );
};
export default Feed;
