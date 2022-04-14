import { PencilIcon } from "@heroicons/react/outline";
import LightButton from "../../shared/components/LightButton";

const SubredditHeader: React.FC<{}> = (props) => {
  return (
    <div>
      <div className="group p-3 hover:cursor-pointer border-2 hover:border-zinc-400 border-zinc-700 bg-blue-500 h-40 z-0">
        <div className = "flex items-center">
          <p className = "text-zinc-700 group-hover:text-zinc-200">Change Background</p>
        </div>
      </div>

      <div className="items-start space-x-5 flex p-5 bg-zinc-800 border-y border-zinc-700">
        <div>
          <div className="group flex hover:cursor-pointer justify-center items-center group h-24 w-24 bg-white border-4 hover:border-zinc-400 border-zinc-200 rounded-full">
            <PencilIcon className="text-zinc-200 group-hover:text-zinc-400 w-12 pb-0.5" />
          </div>
        </div>
        <div>
          <div className="items-center flex space-x-3">
            <h1 className="text-white text-2xl">r/battlestations</h1>
            <h2 className="text-zinc-400"> •</h2>
            <h1 className="text-zinc-400 text-lg">250,000 members</h1>

            <div className="pl-2">
              <LightButton buttonText={"Join Subreddit"} />
            </div>
          </div>

          <p className="my-3 text-zinc-400 text-sm">
            Show off your best reddit battlestations here on r/battlestations.
            It is a really good subreddit. Show off your best reddit
            battlestations here on r/battlestations. It is a really good
            subreddit. Show off your best reddit battlestations here on
            r/battlestations. It is a really good subreddit. Show off your best
            reddit battlestations here on r/battlestations. It is a really good
            subreddit.{" "}
            <span className="text-zinc-200 hover:underline hover:cursor-pointer">
              Edit Description
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SubredditHeader;
