import {
  ChatAlt2Icon,
  HomeIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import React from "react";

const iconClass = "h-4 text-zinc-400 group-hover:text-white transition-colors";

export const optionIds = ["home", "users", "subreddits", "posts"];

export const pageOptionIcons: { [key: string]: React.ReactElement } = {
  home: <HomeIcon className={iconClass} />,
  users: <UserIcon className={iconClass} />,
  subreddits: <UserGroupIcon className={iconClass} />,
  posts: <ChatAlt2Icon className={iconClass} />,
};

export const pageOptionValues: { [key: string]: string } = {
  home: "Home",
  subreddits: "Subreddits",
  users: "All Users",
  posts: "All Posts",
};
