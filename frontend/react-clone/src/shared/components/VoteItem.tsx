import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/outline";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const VoteItem: React.FC<{
  isLoading: boolean;
  voteDirection: number;
  numUpvotes: number;
  handleUpvote: () => void;
  handleDownvote: () => void;
}> = (props) => {
  const hoverClass = `hover:${
    !props.isLoading ? "cursor-pointer" : "cursor-default"
  }`;


  return useMemo(
    () => (
      <div className="flex space-x-2 items-center">
        <div onClick={props.handleUpvote} className={hoverClass}>
          <ArrowUpIcon
            className={`h-4 ${
              props.voteDirection === 1 && !props.isLoading
                ? "text-white"
                : "text-zinc-400"
            } hover:text-white font-bold transition-colors`}
          />
        </div>
        {!props.isLoading ? (
          <p className="text-zinc-400 hover:cursor-default transition-all">
            {props.numUpvotes}
          </p>
        ) : (
          <LoadingSpinner />
        )}
        <div onClick={props.handleDownvote} className={hoverClass}>
          <ArrowDownIcon
            className={`h-4 ${
              props.voteDirection === -1 && !props.isLoading
                ? "text-white"
                : "text-zinc-400"
            } hover:text-white font-bold transition-colors`}
          />
        </div>
      </div>
    ),
    [
      props.handleUpvote,
      props.voteDirection,
      props.isLoading,
      props.numUpvotes,
      props.handleDownvote,
    ]
  );
};
export default VoteItem;
