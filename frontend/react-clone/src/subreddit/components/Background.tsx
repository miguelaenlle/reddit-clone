import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { generateImageUrl } from "../../shared/helpers/generate-image-url";

const Background: React.FC<{
  editingEnabled: boolean;
  subreddit: Subreddit | null;
}> = (props) => {
  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();

  const [imageURL, setImageUrl] = useState<string | null>(
    props.subreddit?.backgroundUrl
      ? generateImageUrl(props.subreddit?.backgroundUrl)
      : null
  );
  const filePickerRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handlePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.files &&
      event.target.files.length === 1 &&
      props.subreddit
    ) {
      const pickedFile = event.target.files[0];
      const newFile = new File([pickedFile], `${Math.random().toString()}`);
      // request to upload the new file
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${props.subreddit.subId}/banner-upload`;

      setIsUploading(true);
      const formData = new FormData();
      formData.append("banner", newFile);
      try {
        const response = await httpClient.sendFormDataRequest(
          url,
          "PATCH",
          formData,
          authContext?.token
        );
        const bannerImageUrl: string | undefined =
          response.data?.banner_image_url;
        if (bannerImageUrl) {
          const newImageUrl = generateImageUrl(bannerImageUrl);
          setImageUrl(newImageUrl);
        }

        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
      }
    }
  };

  const handleClicked = () => {
    if (filePickerRef) {
      if (filePickerRef.current) {
        filePickerRef.current.click();
      }
    }
  };

  useEffect(() => {
    if (props.subreddit) {
      const backgroundUrl = generateImageUrl(props.subreddit.backgroundUrl);

      if (backgroundUrl) {
        setImageUrl(backgroundUrl);
      }
    }
  }, [props.subreddit]);

  return (
    <div
      className={`relative group ${
        props.editingEnabled && !isUploading
          ? "hover:cursor-pointer border-2 hover:border-zinc-400"
          : ""
      } border-zinc-700 h-40 z-0`}
    >
      <input
        className={"hidden"}
        ref={filePickerRef}
        type="file"
        id={"background-image"}
        accept=".jpg,.png,.jpeg"
        onChange={handlePicked}
      />
      {imageURL && (
        <img
          src={imageURL}
          className="absolute w-full h-full object-cover"
        ></img>
      )}
      {props.editingEnabled && (
        <React.Fragment>
          {isUploading ? (
            <div className="flex absolute w-full h-full bg-zinc-800 opacity-80 items-center justify-center">
              <div className="flex flex-col justify-center items-center">
                <div className="flex space-x-3 items-center ">
                  <p className="text-2xl text-zinc-200">Uploading...</p>
                  <LoadingSpinner />
                </div>

                <p className="text-lg text-zinc-400">Do not close this tab</p>
              </div>
            </div>
          ) : (
            <div
              className={`absolute w-full h-full p-5 ${
                props.editingEnabled ? "" : "hidden"
              }`}
              onClick={handleClicked}
            >
              <p className="text-zinc-700 group-hover:text-zinc-200">
                Change Background
              </p>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};
export default Background;
// https://storage.googleapis.com/redddit-bucket/banners/1653075934832--0.11122658281085873--649865aa-4cb7-4526-aba9-145804fa47ad%2524-banner
// https://storage.googleapis.com/redddit-bucket/banners/1653075934832--0.11122658281085873--649865aa-4cb7-4526-aba9-145804fa47ad%24-banner
