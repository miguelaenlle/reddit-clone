import React from "react";

const LightButton: React.FC<{
  buttonImage: React.ReactElement;
  buttonText: string;
}> = (props) => {
  return (
    <div className="w-48 hover:cursor-pointer items-center group flex bg-zinc-800 hover:bg-zinc-900 border border-zinc-700 px-3 py-1 transition-colors">
      <p className="text-zinc-400 group-hover:text-white grow transition-colors">
        {props.buttonText}
      </p>
      {props.buttonImage}
    </div>
  );
};
export default LightButton;
