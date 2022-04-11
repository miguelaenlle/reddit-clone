import HomeDropdown from "./HomeDropdown";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";

const Navbar: React.FC<{}> = (props) => {
  return (
    <div className="fixed flex space-x-2 w-screen items-center h-14 bg-zinc-800 border-zinc-700 border-b px-2">
      <h1 className="text-white text-2xl pr-3">redddit</h1>
      <HomeDropdown />
      <SearchBar />
      <UserDropdown />
    </div>
  );
};
export default Navbar;
