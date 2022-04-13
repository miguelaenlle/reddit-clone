import VoteItem from "../../shared/components/VoteItem";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import { PencilIcon, ReplyIcon, TrashIcon } from "@heroicons/react/outline";
import { imageCSS } from "../../shared/constants/image-class";

const PostItem: React.FC<{}> = (props) => {
  return (
    <div className="pt-5">
      <div className="border-l border-l-zinc-600 pl-3">
        <p className="text-white text-sm">
          u/AutoMod<span className="text-zinc-400">{` 3 hours ago`}</span>
        </p>
        <p className="text-white py-3 text-base">
          A reminder that spreading misinformation regarding COVID-19, vaccines
          or other treatments can result in a post being removed and/or a ban.
          Advocating for or celebrating the death of anyone, or hoping someone
          gets COVID (or any disease) can also result in a ban. Please follow
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
      </div>
    </div>
  );
};
export default PostItem;
