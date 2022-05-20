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
import { useSubredditMembership } from "../hooks/use-subreddit-membership";
import Background from "./Background";
import SubredditInfo from "./SubredditInfo";

const MIN_DESCRIPTION_CHARACTERS = 10;
const MAX_DESCRIPTION_CHARACTERS = 300;

const SubredditHeader: React.FC<{ subId: string }> = (props) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();
  const location = useLocation();
  const subMembership = useSubredditMembership();

  const [editingDescription, setEditingDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [subreddit, setSubreddit] = useState<Subreddit | null>(null);
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newDescriptionError, setNewDescriptionError] = useState<
    string | undefined
  >();

  const [isSubredditMember, setIsSubredditMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const members = subreddit?.members;
    if (members) {
      setMemberCount(members);
    }
  }, [subreddit?.members]);

  useEffect(() => {
    const isMember = subMembership.checkMembershipStatus(props.subId);
    if (isMember) {
      setIsSubredditMember(true);
    } else {
      setIsSubredditMember(false);
    }
  }, [subMembership.subreddits]);

  useEffect(() => {
    const userId = authContext?.userId;
    const subId = subreddit?.subOwnerId;
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

  useEffect(() => {
    initializeData();
  }, [location.pathname]);

  useEffect(() => {
    if (newDescriptionError) {
      setNewDescriptionError(undefined);
    }
  }, [newDescription]);

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
              newDescription,
              prevSubreddit.backgroundUrl,
              prevSubreddit.iconUrl
            );
          } else {
            return null;
          }
        });
        setEditingDescription(false);
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

      console.log("Subreddit data", subData);

      const subredditData = new Subreddit(
        subData.name,
        subData.id,
        subData.sub_owner,
        subData.num_members,
        subData.description,
        subData.background_image_url,
        subData.picture_url
      );

      setSubreddit(subredditData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangeSubredditState = () => {
    if (!subMembership.subredditIsLoading) {
      if (!isSubredditMember) {
        subMembership.joinSubreddit(props.subId);

        setMemberCount((prevMemberCount) => {
          return prevMemberCount + 1;
        });
      } else {
        subMembership.leaveSubreddit(props.subId);
        setMemberCount((prevMemberCount) => {
          if (prevMemberCount > 0) {
            return prevMemberCount - 1;
          } else {
            return 0;
          }
        });
      }
    }
  };
  return (
    <div>
      <Background editingEnabled={editingEnabled} subreddit={subreddit} />

      <div className="items-start space-x-5 flex p-5 bg-zinc-800 border-y border-zinc-700">
        <div>
          <div
            className={`group flex ${
              editingEnabled ? "hover:cursor-pointer hover:border-zinc-400" : ""
            } justify-center items-center groudp h-24 w-24 bg-white border-4 border-zinc-300 rounded-full`}
          >
            <PencilIcon className="p-4 text-zinc-200 group-hover:text-zinc-400" />
          </div>
        </div>
        <SubredditInfo
          isLoggedIn={authContext?.isLoggedIn ?? false}
          isLoading={isLoading}
          httpIsLoading={httpClient.isLoading}
          subreddit={subreddit}
          memberCount={memberCount}
          newDescriptionError={newDescriptionError}
          newDescription={newDescription}
          subredditIsLoading={subMembership.subredditIsLoading}
          isSubredditMember={isSubredditMember}
          editingDescription={editingDescription}
          editingEnabled={editingEnabled}
          handleChangeSubredditState={handleChangeSubredditState}
          handleNewDescriptionInput={handleNewDescriptionInput}
          handleSaveDescription={handleSaveDescription}
          handleStopEditDescription={() => {
            setEditingDescription(false);
          }}
          handleEditDescription={handleEditDescription}
        />
      </div>
    </div>
  );
};
export default React.memo(SubredditHeader);
