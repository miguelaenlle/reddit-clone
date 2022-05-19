import { queryByTitle } from "@testing-library/react";
import { Subreddit } from "../../models/Subreddit";
import SearchItem from "./SearchItem";
import SearchLoader from "./SearchLoader";
import SearchPrompt from "./SearchPrompt";

const SearchPopup: React.FC<{
  isCompact: boolean;
  loading: boolean;
  query: string;
  results: Subreddit[];
  handleConfirmSearch: () => void;
  handleChooseItem: (name: string, subId: string) => void;
}> = (props) => {
  return (
    <div>
      <div className="absolute w-full mt-1 py-1 hover:cursor-pointer bg-zinc-800 border border-white rounded-md">
        {!props.isCompact && (
          <SearchPrompt
            query={props.query}
            handleSearch={props.handleConfirmSearch}
          />
        )}
        {props.loading || props.results.length === 0 ? (
          <SearchLoader />
        ) : (
          props.results.map((result) => {
            return (
              <SearchItem
                key={`subreddit-${result.subId}-result`}
                subName={result.subName}
                subId={result.subId}
                members={result.members}
                handleClick={() => {
                  props.handleChooseItem(result.subName, result.subId);
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
export default SearchPopup;
