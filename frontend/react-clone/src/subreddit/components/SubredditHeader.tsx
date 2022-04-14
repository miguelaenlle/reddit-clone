import LightButton from "../../shared/components/LightButton";

const SubredditHeader: React.FC<{}> = (props) => {
  return (
    <div>
      <div className="bg-blue-500 h-40 z-0"></div>

      <div className="items-start space-x-5 flex p-5 bg-zinc-800 border-y border-zinc-700">
        <div>
          <div className="h-24 w-24 bg-white rounded-full"></div>
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
            subreddit.
          </p>
        </div>
      </div>
    </div>
  );
};
export default SubredditHeader;
