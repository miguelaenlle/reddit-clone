import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import { UserGroupIcon } from "@heroicons/react/outline";

const NewCommunityButton: React.FC<{}> = (props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/create-sub");
  };
  return (
    <Button
      onClick={handleClick}
      buttonImage={
        <UserGroupIcon className="h-5 text-zinc-400 group-hover:text-white transition-colors" />
      }
      buttonText="New Subreddit"
    />
  );
};
export default NewCommunityButton;
