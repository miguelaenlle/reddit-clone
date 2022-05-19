import { UserGroupIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Button from "../../shared/components/Button";

const NewCommunityButton: React.FC<{}> = (props) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();
  const handleClick = () => {
    if (authContext?.isLoggedIn) {
      history.push({
        pathname: "/create-sub",
        state: {
          background: location,
        },
      });
    } else {
      history.push({
        pathname: "/signup",
        state: {
          background: location,
        },
      });
    }
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
