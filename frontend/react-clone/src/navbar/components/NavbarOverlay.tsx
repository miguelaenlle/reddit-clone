import {
  userOptionIcons,
  userOptionValues,
  userOptionIds,
} from "../constants/user-options";
import {
  pageOptionIcons,
  pageOptionValues,
  optionIds,
  urlValues,
} from "../constants/page-options";
import Modal from "../../shared/components/Modal";
import DropdownOption from "./DropdownOption";
import { useHistory, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { UserIcon } from "@heroicons/react/outline";
import SearchBar from "./SearchBar";

const NavbarOverlay: React.FC<{
  handleClose: () => void;
}> = (props) => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();

  const handleSelectOption = (optionId: string) => {
    props.handleClose();
    if (optionIds.includes(optionId)) {
      history.push(urlValues[optionId]);
    } else if (userOptionIds.includes(optionId) && authContext?.userId) {
      if (optionId === "profile") {
        history.push(`/user/${authContext.userId}`);
      } else if (optionId === "new_community") {
        history.push({
          pathname: `/create-sub`,
          state: {
            background: location,
          },
        });
      } else if (optionId === "new_post") {
        history.push({
          pathname: `/create-post`,
          state: {
            background: location,
          },
        });
      }
    } else if (optionId === "logout") {
      authContext?.logout();
      history.push("/home");
    }
  };
  const handleSignup = () => {
    props.handleClose();
    history.push({
      pathname: `/signup`,
      state: {
        background: location,
      },
    });
  };

  return (
    <Modal>
      <div className="w-full h-full pt-20 bg-zinc-800">
        <div className="p-3">
          <SearchBar
            isCompact={true}
            isMobile={true}
            handleClose={props.handleClose}
          />
        </div>
        <br />
        <div className="h-0.5 w-full bg-zinc-700"></div>
        <br />
        {optionIds.map((optionId) => {
          return (
            <DropdownOption
              optionId={optionId}
              optionIcon={pageOptionIcons[optionId]}
              optionText={pageOptionValues[optionId]}
              selectedOption={""}
              handleSelectedOption={() => {
                handleSelectOption(optionId);
              }}
            />
          );
        })}
        <br />
        <div className="h-0.5 w-full bg-zinc-700"></div>
        <br />
        {authContext?.token ? (
          <React.Fragment>
            {userOptionIds.map((optionId) => {
              return (
                <DropdownOption
                  optionId={optionId}
                  optionIcon={userOptionIcons[optionId]}
                  optionText={userOptionValues[optionId]}
                  selectedOption={""}
                  handleSelectedOption={() => {
                    handleSelectOption(optionId);
                  }}
                />
              );
            })}
            <br />
            <div className="h-0.5 w-full bg-zinc-700"></div>
            <br />
            <DropdownOption
              optionId={"logout"}
              optionIcon={userOptionIcons["logout"]}
              optionText={userOptionValues["logout"]}
              selectedOption={""}
              handleSelectedOption={() => {
                handleSelectOption("logout");
              }}
            />
          </React.Fragment>
        ) : (
          <div
            onClick={handleSignup}
            className={
              "flex items-center group space-x-2 px-3 hover:cursor-pointer"
            }
          >
            <UserIcon className="h-4 text-zinc-400 group-hover:text-white" />
            <p className="text-zinc-400 group-hover:text-white">
              Create Account
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default NavbarOverlay;
