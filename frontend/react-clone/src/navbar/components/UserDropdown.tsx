import { UserIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  optionIds,
  userOptionIcons,
  userOptionValues,
} from "../constants/user-options";
import DropdownForUser from "./DropdownForUser";

const UserDropdown: React.FC<{}> = (props) => {
  const history = useHistory();

  const location = useLocation();

  const [selectedOption, setSelectedOption] = useState("user");
  const [storedLocation, setStoredLocation] = useState(location);

  const signedIn = false;

  const modalRoutes = ["/login", "/signup"];

  const handleSelectedOption = (option: string) => {};
  const buttonCSS =
    "group flex grow justify-center items-center hover:cursor-pointer hover:border rounded-md hover:border-zinc-700 space-x-2";

  const handleChangeRoute = (route: string) => {
    if (location.pathname !== route) {
      if (
        modalRoutes.includes(route) &&
        modalRoutes.includes(location.pathname)
      ) {
        history.push({
          pathname: route,
          state: {
            background: storedLocation,
          },
        });
      } else {
        setStoredLocation(location);
        history.push({
          pathname: route,
          state: {
            background: location,
          },
        });
      }
    }
  };

  const handleLogin = () => {
    handleChangeRoute("/login");
  };

  const handleSignup = () => {
    handleChangeRoute("/signup");
  };

  return (
    <React.Fragment>
      {signedIn ? (
        <DropdownForUser
          username={"nexus"}
          optionIds={optionIds}
          optionValues={userOptionValues}
          optionIcons={userOptionIcons}
          selectedOption={selectedOption}
          handleSelectedOption={handleSelectedOption}
        />
      ) : (
        <div className="flex w-52 h-10 space-x-3">
          <div onClick={handleSignup} className={buttonCSS}>
            <UserIcon className="h-4 text-zinc-400 group-hover:text-white" />
            <p className="text-zinc-400 group-hover:text-white">
              Create Account
            </p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default UserDropdown;
