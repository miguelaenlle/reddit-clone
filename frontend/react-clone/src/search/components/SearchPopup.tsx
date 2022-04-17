import SearchItem from "./SearchItem";
import SearchLoader from "./SearchLoader";
import SearchPrompt from "./SearchPrompt";

const SearchPopup: React.FC<{
  loading: boolean;
  query: string;
  results: { [key: string]: any }[];
  handleConfirmSearch: () => void;
  handleChooseItem: (subId: string) => void;
}> = (props) => {
  return (
    <div>
      <div className="absolute w-full mt-1 py-1 hover:cursor-pointer bg-zinc-800 border border-white rounded-md">
        <SearchPrompt
          query={props.query}
          handleSearch={props.handleConfirmSearch}
        />
        {props.loading ? (
          <SearchLoader />
        ) : (
          props.results.length > 0 &&
          props.results.map((result) => {
            return (
              <SearchItem
                key={`subreddit-${result.id}-result`}
                subName={result.name}
                subId={result.id}
                members={result.num_members}
                handleClick={props.handleChooseItem}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
export default SearchPopup;
