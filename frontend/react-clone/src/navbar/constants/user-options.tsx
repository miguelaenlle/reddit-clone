import {
  UserIcon,
  UserGroupIcon,
  ChatAltIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import React from "react";

const iconClass = "h-4 text-zinc-400 group-hover:text-white transition-colors";

export const optionIds = ["profile", "new_community", "new_post"];
export const userOptionIds = optionIds;

export const userOptionIcons: { [key: string]: React.ReactElement } = {
  user: <UserIcon className={iconClass} />,
  profile: <UserIcon className={iconClass} />,
  new_community: <UserGroupIcon className={iconClass} />,
  new_post: <ChatAltIcon className={iconClass} />,
  logout: <LogoutIcon className={iconClass} />,
};

export const userOptionValues: { [key: string]: string } = {
  user: "User",
  profile: "Profile",
  new_community: "New Community",
  new_post: "New Post",
  logout: "Logout",
};
