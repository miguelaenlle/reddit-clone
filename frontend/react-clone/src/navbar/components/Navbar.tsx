import HomeDropdown from "./HomeDropdown";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import { Link } from "react-router-dom";

const Navbar: React.FC<{}> = (props) => {
  return (
    <div className="fixed flex space-x-2 z-50 w-screen items-center h-14 bg-zinc-800 border-zinc-700 border-b px-5">
      <Link to="/">
        <h1 className="hover:cursor-pointer text-white text-2xl pr-3">
          redddit
        </h1>
      </Link>
      <HomeDropdown />
      <SearchBar />
      <UserDropdown />
    </div>
  );
};
export default Navbar;
