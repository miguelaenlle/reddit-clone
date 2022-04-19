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
      className={`p-3 space-x-3 items-center group flex bg-zinc-800 ${
        !props.loading
          ? "hover:cursor-pointer hover:bg-zinc-900"
          : "hover:cursor-not-allowed hover:bg-zinc-700"
      } border border-zinc-700 py-1 transition-colors`}
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
