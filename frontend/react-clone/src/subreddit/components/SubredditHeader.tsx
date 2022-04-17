import React from "react";
import { PencilIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import LightButton from "../../shared/components/LightButton";
import { useLocation } from "react-router-dom";

const SubredditHeader: React.FC<{ subId: string }> = (props) => {
  const httpClient = useHttpClient();
  const location = useLocation();
  const editingEnabled = false;

  const [isLoading, setIsLoading] = useState(false);

  const [subreddit, setSubreddit] = useState<Subreddit | null>(null);

  const initializeData = async () => {
    setIsLoading(true);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${props.subId}`;
      const data = await httpClient.sendRequest(url, "GET");
      const subData = data.data;

      const subredditData = new Subreddit(
        subData.name,
        subData.id,
        subData.num_members,
        subData.description
      );

      setSubreddit(subredditData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initializeData();
  }, [location.pathname]);

  return (
    <div>
      <div
        className={`group p-3 ${
          editingEnabled
            ? "hover:cursor-pointer border-2 hover:border-zinc-400"
            : ""
        } border-zinc-700 bg-blue-500 h-40 z-0`}
      >
        {editingEnabled && (
          <div className="flex items-center">
            <p className="text-zinc-700 group-hover:text-zinc-200">
              Change Background
            </p>
          </div>
        )}
      </div>

      <div className="items-start space-x-5 flex p-5 bg-zinc-800 border-y border-zinc-700">
        <div>
          <div
            className={`group flex ${
              editingEnabled ? "hover:cursor-pointer hover:border-zinc-400" : ""
            }justify-center items-center group h-24 w-24 bg-white border-4 border-zinc-200 rounded-full`}
          >
            {editingEnabled && (
              <PencilIcon className="text-zinc-200 group-hover:text-zinc-400 w-12 pb-0.5" />
            )}
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse w-1/2 h-8 bg-zinc-600"></div>
              <div className="animate-pulse w-2/3 h-12 bg-zinc-700"></div>
            </div>
          ) : (
            subreddit && (
              <React.Fragment>
                <div className="items-center flex space-x-3">
                  <React.Fragment>
                    <h1 className="text-white text-2xl">
                      r/{subreddit.subName}
                    </h1>
                    <h2 className="text-zinc-400"> •</h2>
                    <h1 className="text-zinc-400 text-lg">
                      {subreddit.members}{" "}
                      {subreddit.members === 1 ? "member" : "members"}
                    </h1>
                    <div className="pl-2">
                      <LightButton buttonText={"Join Subreddit"} />
                    </div>
                  </React.Fragment>
                </div>

                <p className="my-3 text-zinc-400 text-sm">
                  {subreddit.description}
                  {editingEnabled && (
                    <span className="text-zinc-200 hover:underline hover:cursor-pointer">
                      {" Edit Description"}
                    </span>
                  )}
                </p>
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(SubredditHeader);
