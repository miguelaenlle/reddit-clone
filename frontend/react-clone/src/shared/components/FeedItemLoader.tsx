const FeedItemLoader: React.FC = (props) => {
  return (
    <div className="w-full p-1.5">
      <div className="bg-zinc-800 border border-zinc-700">
        <div className={`bg-800 h-96`}></div>
        <div className="border-zinc-700 border bg-zinc-900 p-3">
          <div className="animate-pulse w-2/3 h-7 bg-zinc-600 rounded m-3"></div>
          <div className="animate-pulse w-1/2 h-5 bg-zinc-700 rounded m-3"></div>
          <div className="animate-pulse w-2/3 h-5 bg-zinc-800 rounded m-3"></div>
        </div>
      </div>
    </div>
  );
};
export default FeedItemLoader;
