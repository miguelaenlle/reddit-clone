const SearchLoader: React.FC<{}> = (props) => {
  return (
    <div className="flex hover:bg-zinc-700 my-2 px-3 py-1.5 hover:cursor-pointer items-center space-x-2">
      <div className="h-10 w-10 bg-zinc-300 rounded-full mr-1"></div>
      <div>
          <div className = "h-3 w-52 bg-zinc-400 animate-pulse rounded"></div>
          <div className = "py-0.5" />
          <div className = "h-3 w-40 bg-zinc-600 animate-pulse rounded"></div>
      </div>
    </div>
  );
};
export default SearchLoader;
