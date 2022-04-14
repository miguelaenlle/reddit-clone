import LightButton from "../../shared/components/LightButton";

const SubredditResult: React.FC<{}> = (props) => {
  return (
    <div className="flex p-5 bg-zinc-800 border border-zinc-700 items-center">
      <div>
        <div className="w-20 h-20 rounded-full bg-zinc-200 mr-5"></div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <h2 className="hover:cursor-pointer hover:text-white hover:underline text-zinc-200 text-xl">{"r/battlestations"}</h2>
          <h2 className="text-zinc-400"> •</h2>
          <h2 className="text-zinc-400 text-md">{"23,000 members"}</h2>
          <div className="pl-2">
            <LightButton buttonText={"Join Subreddit"} />
          </div>
        </div>
        <h2 className="text-zinc-400 text-sm">
          Show off your best reddit battlestations here on r/battlestations. It
          is a really good subreddit. Show off your best reddit battlestations
          here on r/battlestations. It is a really good subreddit. Show off your
          best reddit battlestations here on r/battlestations. It is a really
          good subreddit. Show off your best reddit battlestations here on
          r/battlestations. It is a really good subreddit.
        </h2>
      </div>
    </div>
  );
};
export default SubredditResult;
