import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import LightButton from "../../shared/components/LightButton";
import { generateImageUrl } from "../../shared/helpers/generate-image-url";
import { useWindowDimensions } from "../../shared/hooks/use-window-dimensions";

const SubredditResult: React.FC<{
  subName: string;
  subId: string;
  members: number;
  description: string;
  isMember: boolean;
  subredditLoading: boolean;
  iconURL: string;
}> = (props) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const windowDimensions = useWindowDimensions();
  const [isMember, setIsMember] = useState(props.isMember);
  const [subredditMembers, setSubredditMembers] = useState<number>(
    props.members
  );

  const handleClickSubreddit = async () => {
    if (isMember) {
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${props.subId}/leave`;
      try {
        await httpClient.sendRequest(url, "POST", {}, authContext?.token);

        setSubredditMembers((prevMembers) => {
          return prevMembers - 1;
        });
        setIsMember(false);
      } catch (error) {}
    } else {
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${props.subId}/join`;
      try {
        await httpClient.sendRequest(url, "POST", {}, authContext?.token);

        setSubredditMembers((prevMembers) => {
          return prevMembers + 1;
        });
        setIsMember(true);
      } catch (error) {}
    }
  };

  return (
    <div className="flex p-5 bg-zinc-800 border border-zinc-700 items-center">
      <div>
        <div className="flex items-center justify-center  md:w-20 md:h-20 xs:w-10 xs:h-10 rounded-full bg-zinc-500 mr-5">
          {props.iconURL ? (
            <img
              className={`absolute z-0 md:w-20 md:h-20 xs:w-10 xs:h-10 rounded-full object-cover`}
              src={generateImageUrl(props.iconURL)}
            />
          ) : (
            <p className="text-zinc-700 text-3xl">r/</p>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <Link to={`/sub/${props.subId}`}>
            <h2 className="hover:cursor-pointer hover:text-white hover:underline text-zinc-200 md:text-xl">
              {`r/${props.subName}`}
            </h2>
          </Link>
          <h2 className="text-zinc-400 xs:hidden"> •</h2>
          <h2 className="text-zinc-400 text-md">{`${subredditMembers} members`}</h2>
          <div className="pl-2 xs:hidden">
            {authContext?.token && (
              <LightButton
                onClick={handleClickSubreddit}
                loading={httpClient.isLoading}
                buttonText={isMember ? "Leave Subreddit" : "Join Subreddit"}
              />
            )}
          </div>
        </div>
        <div>
          <div className="md:hidden">
            {authContext?.token && (
              <LightButton
                onClick={handleClickSubreddit}
                loading={httpClient.isLoading}
                buttonText={isMember ? "Leave Subreddit" : "Join Subreddit"}
              />
            )}
          </div>
        </div>

        <h2 className="text-zinc-400 text-sm xs:hidden">{props.description}</h2>
      </div>
    </div>
  );
};
export default SubredditResult;
