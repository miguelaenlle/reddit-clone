import HomeDropdown from "./HomeDropdown";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import { Link } from "react-router-dom";
import { useWindowDimensions } from "../../shared/hooks/use-window-dimensions";
import React from "react";

const Navbar: React.FC<{}> = (props) => {
  const windowDimensions = useWindowDimensions();
  return (
    <div className="fixed flex space-x-2 z-50 w-screen items-center h-14 bg-zinc-800 border-zinc-700 border-b px-5">
      <Link to="/">
        <h1 className="hover:cursor-pointer text-white text-2xl pr-3">
          redddit
        </h1>
      </Link>
      {windowDimensions.width > 640 && (
        <React.Fragment>
          <HomeDropdown />
          <SearchBar isCompact={false} />
          <UserDropdown />
        </React.Fragment>
      )}
    </div>
  );
};
export default Navbar;
