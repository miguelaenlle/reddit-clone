import React from "react";

const LightButton: React.FC<{
  onClick?: () => void;
  buttonImage: React.ReactElement;
  buttonText: string;
}> = (props) => {
  return (
    <button onClick = {props.onClick} className="p-3 space-x-3 hover:cursor-pointer items-center group flex bg-zinc-800 hover:bg-zinc-900 border border-zinc-700 py-1 transition-colors">
      <p className="text-zinc-400 group-hover:text-white grow transition-colors">
        {props.buttonText}
      </p>
      {props.buttonImage}
    </button>
  );
};
export default LightButton;
