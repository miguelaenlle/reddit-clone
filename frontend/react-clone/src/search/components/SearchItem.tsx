const SearchItem: React.FC<{
  subName: string;
  subId: string;
  members: number;
  handleClick: (subName: string) => void;
}> = (props) => {
  const handleClick = () => {
    props.handleClick(props.subId);
  };
  return (
    <div
      onMouseDown={handleClick}
      className="flex hover:bg-zinc-700 my-2 px-3 py-1.5 hover:cursor-pointer items-center space-x-2"
    >
      <div className="h-10 w-10 bg-zinc-300 rounded-full mr-1"></div>
      <div>
        <p className="text-zinc-200">r/{props.subName}</p>
        <p className="text-zinc-400">{props.members} members</p>
      </div>
    </div>
  );
};
export default SearchItem;
