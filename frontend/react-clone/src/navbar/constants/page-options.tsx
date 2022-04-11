import {
  ChatAlt2Icon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import React from "react";

const iconClass = "h-4 text-zinc-400 group-hover:text-white transition-colors";

export const optionIds = ["home", "subreddits", "allPosts"];

export const pageOptionIcons: {[key: string] : React.ReactElement} = {
  home: <HomeIcon className={iconClass} />,
  subreddits: <UserGroupIcon className={iconClass} />,
  allPosts: <ChatAlt2Icon className={iconClass} />,
};

export const pageOptionValues: { [key: string]: string } = {
  home: "Home",
  subreddits: "My Subreddits",
  allPosts: "All Posts",
};
