import { AnnotationIcon, XIcon } from "@heroicons/react/outline";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import { imageCSS } from "../../shared/constants/image-class";

const CommentField: React.FC<{
  isLoading: boolean;
  replyText: string;
  handleReplyChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmitCommentToPost: () => void;
  handleCloseReply: () => void;
  error: string | undefined;
  commentOnComment: boolean;
}> = (props) => {
  return (
    <div className="pt-5">
      <InputField
        name={""}
        placeholder={"Comment"}
        touched={undefined}
        error={undefined}
        value={props.replyText}
        onBlur={() => {}}
        onChange={props.handleReplyChange}
      />
      {props.error && <p className="text-red-500">{props.error}</p>}
      <div className="flex items-center space-x-2 pt-1.5">
        {!props.commentOnComment && <div className="flex-grow"></div>}

        <LightButton
          loading={props.isLoading}
          onClick={props.handleSubmitCommentToPost}
          buttonImage={<AnnotationIcon className={imageCSS} />}
          buttonText="Comment"
        />

        <LightButton
          onClick={props.handleCloseReply}
          buttonImage={<XIcon className={imageCSS} />}
          buttonText="Cancel"
        />
      </div>
    </div>
  );
};
export default CommentField;
