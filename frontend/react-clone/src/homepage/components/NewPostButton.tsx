import Button from "../../shared/components/Button";
import { ChatAltIcon } from "@heroicons/react/outline";
import { useHistory, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const NewPostButton: React.FC<{ initialSubId?: string }> = (props) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();

  


  const handleClick = () => {
    if (authContext?.isLoggedIn) {
      history.push({
        pathname: `/create-post`,
        search: props.initialSubId ? "?subId=" + props.initialSubId : undefined,
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
      buttonImage={
        <ChatAltIcon className="h-5 text-zinc-400 group-hover:text-white transition-colors" />
      }
      buttonText="New Post"
      onClick={handleClick}
    />
  );
};
export default NewPostButton;
