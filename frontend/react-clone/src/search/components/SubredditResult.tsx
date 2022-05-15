import { useState } from "react";
import { Link } from "react-router-dom";
import LightButton from "../../shared/components/LightButton";

const SubredditResult: React.FC<{
  subName: string;
  subId: string;
  members: number;
  description: string;
}> = (props) => {
  const [isMember, setIsMember] = useState(false);
  const handleClickSubreddit = () => {
    
  }
  return (
    <div className="animate-fade flex p-5 bg-zinc-800 border border-zinc-700 items-center">
      <div>
        <div className="w-20 h-20 rounded-full bg-zinc-200 mr-5"></div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <Link to={`/sub/${props.subId}`}>
            <h2 className="hover:cursor-pointer hover:text-white hover:underline text-zinc-200 text-xl">
              {`r/${props.subName}`}
            </h2>
          </Link>
          <h2 className="text-zinc-400"> •</h2>
          <h2 className="text-zinc-400 text-md">{`${props.members} members`}</h2>
          <div className="pl-2">
            <LightButton buttonText={isMember ? "Leave Subreddit" : "Join Subreddit"} />
          </div>
        </div>
        <h2 className="text-zinc-400 text-sm">{props.description}</h2>
      </div>
    </div>
  );
};
export default SubredditResult;
