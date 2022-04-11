import React from "react";

const Button: React.FC<{
  buttonImage: React.ReactElement;
  buttonText: string;
}> = (props) => {
  return (
    <div className="w-56 hover:cursor-pointer items-center group flex bg-zinc-700 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 rounded-md transition-colors">
      <p className="text-white grow transition-colors">
        {props.buttonText}
      </p>
      {props.buttonImage}
    </div>
  );
};
export default Button;
