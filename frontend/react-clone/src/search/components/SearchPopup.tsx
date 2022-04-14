import { useNavigate } from "react-router-dom";

import { SearchIcon } from "@heroicons/react/outline";
import SearchItem from "./SearchItem";
import SearchLoader from "./SearchLoader";
import SearchPrompt from "./SearchPrompt";

const SearchPopup: React.FC<{
  query: string;
  handleConfirmSearch: () => void;
}> = (props) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="absolute w-full mt-1 py-1 hover:cursor-pointer bg-zinc-800 border border-white rounded-md">
        <SearchPrompt
          query={props.query}
          handleSearch={props.handleConfirmSearch}
        />
        <SearchLoader />
      </div>
    </div>
  );
};
export default SearchPopup;
