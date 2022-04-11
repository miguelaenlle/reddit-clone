import HomeDropdown from "./HomeDropdown";
import SearchBar from "./SearchBar";

const Navbar: React.FC<{}> = (props) => {
  return (
    <div className="fixed flex space-x-5 w-screen items-center h-14 bg-zinc-800 border-zinc-700 border-b px-5">
      <h1 className="text-white text-2xl">redddit</h1>
      <HomeDropdown />
      <SearchBar />
    </div>
  );
};
export default Navbar;
