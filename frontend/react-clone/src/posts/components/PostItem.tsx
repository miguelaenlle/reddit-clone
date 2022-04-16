import VoteItem from "../../shared/components/VoteItem";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import { PencilIcon, ReplyIcon, TrashIcon } from "@heroicons/react/outline";
import { imageCSS } from "../../shared/constants/image-class";
import React, { useState } from "react";

const PostItem: React.FC<{}> = (props) => {
  const [expanded, setExpanded] = useState(true);

  const handleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <div className="flex pt-5">
      <div onClick={handleExpand} className="group hover:cursor-pointer pr-3">
        <div className="group-hover:bg-zinc-400 bg-zinc-700 w-0.5 h-full"></div>
      </div>
      <div className="grow">
        <p className={`text-white text-sm ${!expanded ? "py-2" : ""}`}>
          u/AutoMod<span className="text-zinc-400">{` 3 hours ago`}</span>
        </p>
        {expanded && (
          <React.Fragment>
            <p className="text-white py-3 text-base">
              A reminder that spreading misinformation regarding COVID-19,
              vaccines or other treatments can result in a post being removed
              and/or a ban. Advocating for or celebrating the death of anyone,
              or hoping someone gets COVID (or any disease) can also result in a
              ban. Please follow
            </p>
            <div className="flex space-x-4">
              <VoteItem
                voteDirection={1}
                numUpvotes={1}
                handleUpvote={() => {}}
                handleDownvote={() => {}}
              />
              <ButtonNoBorder
                buttonImage={<ReplyIcon className={imageCSS} />}
                buttonText={"Reply"}
              />
              <ButtonNoBorder
                buttonImage={<PencilIcon className={imageCSS} />}
                buttonText={"Edit"}
              />
              <ButtonNoBorder
                buttonImage={<TrashIcon className={imageCSS} />}
                buttonText={"Delete"}
              />
            </div>
            {props.children}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
export default PostItem;
