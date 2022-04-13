import React from "react";

const ButtonNoBorder: React.FC<{
  buttonImage: React.ReactElement;
  buttonText: string;
}> = (props) => {
  return (
    <div className="group hover:cursor-pointer items-center group flex bg-transparent border border-zinc-800 transition-colors">
      <p className="text-zinc-400 group-hover:text-white transition-colors pr-2">
        {props.buttonText}
      </p>
      {props.buttonImage}
    </div>
  );
};
export default ButtonNoBorder;
