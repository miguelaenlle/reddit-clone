import Button from "../../shared/components/Button";
import { UserGroupIcon } from "@heroicons/react/outline";

const NewCommunityButton: React.FC<{}> = (props) => {
  return (
    <Button
      buttonImage={
        <UserGroupIcon className="h-5 text-white transition-colors" />
      }
      buttonText="New Subreddit"
    />
  );
};
export default NewCommunityButton;
