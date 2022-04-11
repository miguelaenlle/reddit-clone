const SearchBar: React.FC<{}> = (props) => {
  return (
    <input
      placeholder="Search"
      className="grow border border-zinc-700 space-x-2 h-10 rounded-md bg-transparent text-white placeholder-zinc-400 px-3"
    ></input>
  );
};
export default SearchBar;
