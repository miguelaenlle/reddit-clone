import React, { useContext } from "react";
import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import LightButton from "../../shared/components/LightButton";
import { useLocation } from "react-router-dom";
import InputField from "../../shared/components/InputField";
import Button from "../../shared/components/Button";
import { CheckIcon } from "@heroicons/react/outline";
import { imageCSS } from "../../shared/constants/image-class";
import ButtonNoBorder from "../../shared/components/ButtonNoBorder";
import { AuthContext } from "../../context/auth-context";

const MIN_DESCRIPTION_CHARACTERS = 10;
const MAX_DESCRIPTION_CHARACTERS = 300;

const SubredditHeader: React.FC<{ subId: string }> = (props) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const location = useLocation();

  const [editingDescription, setEditingDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [subreddit, setSubreddit] = useState<Subreddit | null>(null);
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newDescriptionError, setNewDescriptionError] = useState<
    string | undefined
  >();

  useEffect(() => {
    const userId = authContext?.userId;
    const subId = subreddit?.subOwnerId;
    console.log("user id", userId, "subId", subId);
    if (userId && subId) {
      if (userId === subId) {
        setEditingEnabled(true);
      } else {
        setEditingEnabled(false);
      }
    } else {
      setEditingEnabled(false);
    }
  }, [authContext?.userId, subreddit?.subId]);

  const handleEditDescription = () => {
    if (subreddit) {
      setNewDescription(subreddit.description);
    }
    setEditingDescription(true);
  };

  const handleSaveDescription = async () => {
    let isValid = true;
    setNewDescriptionError(undefined);
    if (newDescription.length > MAX_DESCRIPTION_CHARACTERS) {
      setNewDescriptionError(
        `Description must be under ${MAX_DESCRIPTION_CHARACTERS} characters long`
      );
      isValid = false;
    }
    if (newDescription.length < MIN_DESCRIPTION_CHARACTERS) {
      setNewDescriptionError(
        `Description must be ${MIN_DESCRIPTION_CHARACTERS}+ characters long`
      );
      isValid = false;
    }
    if (isValid && subreddit) {
      // update the description in the database
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${subreddit.subId}`;
      const token = authContext?.token;
      console.log(url, token);

      try {
        const result = await httpClient.sendRequest(
          url,
          "PATCH",
          {
            newDescription,
          },
          token
        );
        setSubreddit((prevSubreddit: Subreddit | null) => {
          if (prevSubreddit) {
            return new Subreddit(
              prevSubreddit.subName,
              prevSubreddit.subId,
              prevSubreddit.subOwnerId,
              prevSubreddit.members,
              newDescription
            );
          } else {
            return null;
          }
        });
        setEditingDescription(false);
        console.log(result.ok);
      } catch (error) {
        setNewDescriptionError(
          "Failed to update the description, please try again."
        );
      }

      // update the description in the state
    }
  };

  const handleNewDescriptionInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewDescription(e.target.value);
  };

  const initializeData = async () => {
    setIsLoading(true);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${props.subId}`;
      const data = await httpClient.sendRequest(url, "GET");
      const subData = data.data;

      const subredditData = new Subreddit(
        subData.name,
        subData.id,
        subData.sub_owner,
        subData.num_members,
        subData.description
      );

      setSubreddit(subredditData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initializeData();
  }, [location.pathname]);

  useEffect(() => {
    if (newDescriptionError) {
      setNewDescriptionError(undefined);
    }
  }, [newDescription]);

  return (
    <div>
      <div
        className={`group p-3 ${
          editingEnabled
            ? "hover:cursor-pointer border-2 hover:border-zinc-400"
            : ""
        } border-zinc-700 bg-blue-500 h-40 z-0`}
      >
        {editingEnabled && (
          <div className="flex items-center">
            <p className="text-zinc-700 group-hover:text-zinc-200">
              Change Background (WIP)
            </p>
          </div>
        )}
      </div>

      <div className="items-start space-x-5 flex p-5 bg-zinc-800 border-y border-zinc-700">
        <div>
          {/* <img src={`https://storage.cloud.google.com/redddit-bucket/icons/1650510449841_img-2.PNG`} */}
          <div
            className={`group flex ${
              editingEnabled ? "hover:cursor-pointer hover:border-zinc-400" : ""
            }justify-center items-center groudp h-24 w-24 bg-white border-4 border-zinc-200 rounded-full`}
          ></div>
        </div>
        <div className="w-full">
          {isLoading ? (
            <div className="space-y-2">
              <div className="animate-pulse w-1/2 h-8 bg-zinc-600"></div>
              <div className="animate-pulse w-2/3 h-12 bg-zinc-700"></div>
            </div>
          ) : (
            subreddit && (
              <React.Fragment>
                <div className="items-center flex space-x-3">
                  <React.Fragment>
                    <h1 className="text-white text-2xl">
                      r/{subreddit.subName}
                    </h1>
                    <h2 className="text-zinc-400"> •</h2>
                    <h1 className="text-zinc-400 text-lg">
                      {subreddit.members}{" "}
                      {subreddit.members === 1 ? "member" : "members"}
                    </h1>
                    <div className="pl-2">
                      <LightButton buttonText={"Join Subreddit"} />
                    </div>
                  </React.Fragment>
                </div>
                {editingDescription ? (
                  <div className="py-2">
                    <InputField
                      name="new-description"
                      placeholder="New Description..."
                      touched={false}
                      error={newDescriptionError}
                      value={newDescription} // initially subreddit.description
                      onBlur={() => {}}
                      onChange={handleNewDescriptionInput}
                    />
                    <div className="flex space-x-2 items-center">
                      <LightButton
                        loading={httpClient.isLoading}
                        buttonImage={<CheckIcon className={imageCSS} />}
                        buttonText="Save"
                        onClick={handleSaveDescription}
                      />
                      <ButtonNoBorder
                        buttonImage={<XIcon className={imageCSS} />}
                        buttonText="Cancel"
                        handleClick={() => {
                          setEditingDescription(false);
                        }}
                      />
                      <div className="flex-grow"></div>
                      <p
                        className={`${
                          newDescription.length < MIN_DESCRIPTION_CHARACTERS ||
                          newDescription.length > MAX_DESCRIPTION_CHARACTERS
                            ? "text-red-600"
                            : "text-zinc-400"
                        }`}
                      >
                        {newDescription.length}/{MAX_DESCRIPTION_CHARACTERS}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="my-3 text-zinc-400 text-sm">
                    {subreddit.description}{" "}
                    {editingEnabled && (
                      <span
                        onClick={handleEditDescription}
                        className="text-zinc-200 hover:underline hover:cursor-pointer"
                      >
                        {"Edit Description"}
                      </span>
                    )}
                  </p>
                )}
              </React.Fragment>
            )
          )}
          {newDescriptionError && (
            <p className="text-red-600">{newDescriptionError}</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(SubredditHeader);
