import { UserGroupIcon } from "@heroicons/react/outline";
import { useHistory } from "react-router-dom";
import Button from "../../shared/components/Button";

const NewCommunityButton: React.FC<{}> = (props) => {
  const history = useHistory();
  const handleClick = () => {
    history.push("/create-sub");
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
