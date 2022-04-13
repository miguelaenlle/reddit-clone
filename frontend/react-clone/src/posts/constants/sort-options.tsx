import {
  TrendingUpIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  ClockIcon,
} from "@heroicons/react/outline";
import React from "react";

const iconClass = "h-4 text-zinc-400 group-hover:text-white transition-colors";

export const sortOptionIds = ["top", "controversial", "new", "old"];

export const sortOptionIcons: { [key: string]: React.ReactElement } = {
  top: <TrendingUpIcon className={iconClass} />,
  controversial: <ExclamationCircleIcon className={iconClass} />,
  new: <PlusCircleIcon className={iconClass} />,
  old: <ClockIcon className={iconClass} />,
};

export const sortOptionValues: { [key: string]: string } = {
  top: "Top",
  controversial: "Controversial",
  new: "New",
  old: "Old",
};
