const PostItemLoader: React.FC<{}> = (props) => {
  return (
    <div className="flex pt-5">
      <div className="group hover:cursor-pointer pr-3">
        <div className="group-hover:bg-zinc-400 bg-zinc-700 w-0.5 h-full"></div>
      </div>
      <div className="grow space-y-1">
        <div className="h-6 w-52 bg-zinc-400 animate-pulse rounded"></div>
        <div className="h-6 w-96 bg-zinc-700 animate-pulse rounded"></div>
        <div className="h-6 w-96 bg-zinc-700 animate-pulse rounded"></div>
        <div className="h-6 w-96 bg-zinc-700 animate-pulse rounded"></div>
      </div>
    </div>
  );
};
export default PostItemLoader;
