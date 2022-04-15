import Button from "../../shared/components/Button";
import { ChatAltIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";

const NewPostButton: React.FC<{}> = (props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/create-post");
  };
  return (
    <Button
      buttonImage={
        <ChatAltIcon className="h-5 text-zinc-400 group-hover:text-white transition-colors" />
      }
      buttonText="New Post"
      onClick={handleClick}
    />
  );
};
export default NewPostButton;
