import Button from "../../shared/components/Button";
import { ChatAltIcon } from "@heroicons/react/outline";

const NewPostButton: React.FC<{}> = (props) => {
  return (
    <Button
      buttonImage={
        <ChatAltIcon className="h-5 text-zinc-200 group-hover:text-white transition-colors" />
      }
      buttonText="New Post"
    />
  );
};
export default NewPostButton;
