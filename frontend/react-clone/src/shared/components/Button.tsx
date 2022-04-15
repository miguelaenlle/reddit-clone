import React from "react";

const Button: React.FC<{
  buttonImage: React.ReactElement;
  buttonText: string;
  onClick?: () => void;
}> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className="w-56 hover:cursor-pointer items-center group flex bg-zinc-900 hover:bg-zinc-900 border border-zinc-800 px-3 transition-colors"
    >
      <p className="text-zinc-400 group-hover:text-white grow transition-colors">
        {props.buttonText}
      </p>
      {props.buttonImage}
    </div>
  );
};
export default Button;
