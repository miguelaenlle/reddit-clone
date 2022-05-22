import { MenuIcon, XIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import Modal from "../../shared/components/Modal";
import { imageCSS } from "../../shared/constants/image-class";
import { useWindowDimensions } from "../../shared/hooks/use-window-dimensions";
import DropdownOption from "./DropdownOption";
import HomeDropdown from "./HomeDropdown";
import NavbarOverlay from "./NavbarOverlay";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";

const Navbar: React.FC<{}> = (props) => {
  const windowDimensions = useWindowDimensions();
  const [isDisplaying, setIsDisplaying] = useState(false);

  const handleClickIcon = () => {
    setIsDisplaying((prevDisplaying) => !prevDisplaying);
  };

  const handleClose = () => {
    setIsDisplaying(false);
  };

  return (
    <div className="fixed flex space-x-2 z-50 w-screen items-center h-14 bg-zinc-800 border-zinc-700 border-b px-5">
      {windowDimensions.width < 1000 && (
        <div
          className="group hover:cursor-pointer mr-2"
          onClick={handleClickIcon}
        >
          {isDisplaying ? (
            <XIcon className="h-6 animate-fade text-zinc-200 group-hover:text-zinc-400" />
          ) : (
            <MenuIcon className="h-6 animate-fade text-zinc-200 group-hover:text-zinc-400" />
          )}
        </div>
      )}
      <Link to="/">
        <h1 className="hover:cursor-pointer text-white text-2xl pr-3">
          redddit
        </h1>
      </Link>

      {windowDimensions.width > 1000 && (
        <React.Fragment>
          <HomeDropdown />
          <SearchBar isCompact={false} />
          <UserDropdown />
        </React.Fragment>
      )}
      {(isDisplaying && windowDimensions.width < 1000 )&& (
        <NavbarOverlay handleClose={handleClose} />
      )}
    </div>
  );
};
export default Navbar;
