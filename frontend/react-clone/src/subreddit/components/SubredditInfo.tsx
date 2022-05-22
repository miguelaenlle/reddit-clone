import { CheckIcon, XIcon } from "@heroicons/react/outline";
import React from "react";
import { Subreddit } from "../../models/Subreddit";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import { imageCSS } from "../../shared/constants/image-class";
import { useWindowDimensions } from "../../shared/hooks/use-window-dimensions";

const MIN_DESCRIPTION_CHARACTERS = 10;
const MAX_DESCRIPTION_CHARACTERS = 300;
const SubredditInfo: React.FC<{
  isLoggedIn: boolean;
  isLoading: boolean;
  httpIsLoading: boolean;
  subreddit: Subreddit | null;
  memberCount: number;

  newDescriptionError: string | undefined;
  newDescription: string;

  subredditIsLoading: boolean;
  isSubredditMember: boolean;
  editingDescription: boolean;

  editingEnabled: boolean;

  handleChangeSubredditState: () => void;
  handleNewDescriptionInput: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSaveDescription: () => void;
  handleStopEditDescription: () => void;
  handleEditDescription: () => void;
}> = (props) => {
  const windowDimensions = useWindowDimensions();
  return (
    <div className="w-full">
      {props.isLoading ? (
        <div className="space-y-2">
          <div className="animate-pulse w-1/2 h-8 bg-zinc-600"></div>
          <div className="animate-pulse w-2/3 h-12 bg-zinc-700"></div>
        </div>
      ) : (
        props.subreddit && (
          <React.Fragment>
            <div className="items-center xs:justify-center flex xs:flex-col xs:pt-10 space-x-3">
              <React.Fragment>
                <h1 className="text-white text-2xl">
                  r/{props.subreddit.subName}
                </h1>
                {windowDimensions.width <= 640 && (
                  <React.Fragment>
                    <p className="my-3 text-zinc-400 text-sm">
                      {props.subreddit.description}{" "}
                      {!props.editingDescription && (
                        <span
                          onClick={props.handleEditDescription}
                          className="text-zinc-200 hover:underline hover:cursor-pointer"
                        >
                          {"Edit Description"}
                        </span>
                      )}
                    </p>
                  </React.Fragment>
                )}
                {windowDimensions.width > 640 && (
                  <h2 className="text-zinc-400"> •</h2>
                )}
                <div className="flex items-center space-x-3 xs:py-2">
                  <h1 className="text-zinc-400 text-lg">
                    {props.memberCount}{" "}
                    {props.memberCount === 1 ? "member" : "members"}
                  </h1>
                  {windowDimensions.width <= 640 && (
                    <h2 className="text-zinc-400"> •</h2>
                  )}
                  {props.isLoggedIn && (
                    <div className="md:pl-2">
                      <LightButton
                        onClick={props.handleChangeSubredditState}
                        loading={props.subredditIsLoading}
                        buttonText={
                          props.isSubredditMember
                            ? "Leave Subreddit"
                            : "Join Subreddit"
                        }
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            </div>
            {props.editingDescription ? (
              <div className="py-2">
                <InputField
                  name="new-description"
                  placeholder="New Description..."
                  touched={false}
                  error={props.newDescriptionError}
                  value={props.newDescription} // initially subreddit.description
                  onBlur={() => {}}
                  onChange={props.handleNewDescriptionInput}
                />
                <div className="flex space-x-2 items-center">
                  <LightButton
                    loading={props.httpIsLoading}
                    buttonImage={<CheckIcon className={imageCSS} />}
                    buttonText="Save"
                    onClick={props.handleSaveDescription}
                  />
                  <ButtonNoBorder
                    buttonImage={<XIcon className={imageCSS} />}
                    buttonText="Cancel"
                    handleClick={() => {
                      props.handleStopEditDescription();
                      //   setEditingDescription(false);
                    }}
                  />
                  <div className="flex-grow"></div>
                  <p
                    className={`${
                      props.newDescription.length <
                        MIN_DESCRIPTION_CHARACTERS ||
                      props.newDescription.length > MAX_DESCRIPTION_CHARACTERS
                        ? "text-red-600"
                        : "text-zinc-400"
                    }`}
                  >
                    {props.newDescription.length}/{MAX_DESCRIPTION_CHARACTERS}
                  </p>
                </div>
              </div>
            ) : (
              <div className="xs:w-full xs:justify-center xs:hidden">
                <p className="my-3 text-zinc-400 text-sm">
                  {props.subreddit.description}{" "}
                  <span
                    onClick={props.handleEditDescription}
                    className="text-zinc-200 hover:underline hover:cursor-pointer"
                  >
                    {"Edit Description"}
                  </span>
                </p>
              </div>
            )}
          </React.Fragment>
        )
      )}
      {props.newDescriptionError && (
        <p className="text-red-600">{props.newDescriptionError}</p>
      )}
    </div>
  );
};
export default SubredditInfo;
