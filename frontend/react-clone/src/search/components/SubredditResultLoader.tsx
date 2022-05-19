const SubredditResultLoader: React.FC<{}> = (props) => {
  return (
    <div className="animate-fade flex p-5 bg-zinc-800 border border-zinc-700 items-center">
      <div>
        <div className="animate-pulse w-20 h-20 rounded-full bg-zinc-700 mr-5"></div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="animate-pulse h-5 w-96 hover:cursor-pointer hover:text-white hover:underline bg-zinc-600"></div>
        </div>
        <div className="animate-pulse h-5 w-72 hover:cursor-pointer hover:text-white hover:underline bg-zinc-700"></div>
      </div>
    </div>
  );
};
export default SubredditResultLoader;
