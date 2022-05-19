import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LightButton: React.FC<{
  submit?: boolean;
  onClick?: () => void;
  loading?: boolean;
  buttonImage?: React.ReactElement;
  buttonText: string;
}> = (props) => {
  return (
    <button
      type={props.submit ? "submit" : "button"}
      disabled={props.loading}
      onClick={props.onClick}
      className={`group p-3 space-x-3 items-center flex bg-zinc-800 ${
        !props.loading
          ? "group-hover:cursor-pointer group-hover:bg-zinc-900 text-zinc-400 hover:text-white"
          : "group-hover:cursor-not-allowed group-hover:bg-zinc-700 text-zinc-500"
      } border border-zinc-700 py-1`}
    >
      <p
        className={`${!props.loading ? "text-zinc-400" : "text-zinc-500"}${
          !props.loading ? "group-hover:text-white" : ""
        } grow transition-colors`}
      >
        {props.buttonText}
      </p>
      {props.buttonImage && !props.loading && props.buttonImage}
      {props.loading && <LoadingSpinner />}
    </button>
  );
};
export default LightButton;
