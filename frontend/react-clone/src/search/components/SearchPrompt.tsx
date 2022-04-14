import { SearchIcon } from "@heroicons/react/outline";

const SearchPrompt: React.FC<{ query: string; handleSearch: () => void }> = (
  props
) => {
  return (
    <div
      onClick={props.handleSearch}
      className="flex hover:bg-zinc-700 p-3 items-center space-x-2"
    >
      <SearchIcon className="text-zinc-400 h-5" />
      {props.query && (
        <p className="text-zinc-200">
          <span className="text-zinc-400">Search for</span> {props.query}
        </p>
      )}
    </div>
  );
};
export default SearchPrompt;
