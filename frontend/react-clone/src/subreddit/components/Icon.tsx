import { PencilIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import LoadingSpinnerNoBounds from "../../shared/components/LoadingSpinnerNoBounds";
import { generateImageUrl } from "../../shared/helpers/generate-image-url";

const Icon: React.FC<{
  editingEnabled: boolean;
  subreddit: Subreddit | null;
}> = (props) => {
  const authContext = useContext(AuthContext);
  const [imageURL, setImageUrl] = useState<string | null>(
    props.subreddit?.backgroundUrl
      ? generateImageUrl(props.subreddit?.backgroundUrl)
      : null
  );

  const filePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const iconUrl = props.subreddit?.iconUrl;
    if (iconUrl) {
      const imageUrl = generateImageUrl(iconUrl);
      setImageUrl(imageUrl);
    }
  }, [props.subreddit?.iconUrl]);

  const httpClient = useHttpClient();

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
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${props.subreddit.subId}/icon-upload`;

      setIsUploading(true);
      const formData = new FormData();
      formData.append("icon", newFile);
      try {
        const response = await httpClient.sendFormDataRequest(
          url,
          "PATCH",
          formData,
          authContext?.token
        );
        const iconImageUrl: string | undefined = response.data?.icon_image_url;
        if (iconImageUrl) {
          const newImageUrl = generateImageUrl(iconImageUrl);
          setImageUrl(newImageUrl);
        }

        setIsUploading(false);
      } catch {
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

  return (
    <div>
      <div
        onClick={() => {
          if (props.editingEnabled && !isUploading) {
            handleClicked();
          }
        }}
        className={`relative z-10 group flex ${
          props.editingEnabled && !isUploading
            ? "hover:cursor-pointer hover:border-zinc-400 border-zinc-300 "
            : "disabled border-zinc-400"
        } justify-center items-center group h-24 w-24 bg-clear border-4 rounded-full`}
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
            className={`absolute z-0 w-full h-full rounded-full object-cover ${
              isUploading ? "opacity-20" : ""
            }`}
            src={imageURL}
          />
        )}
        {props.editingEnabled && !isUploading && (
          <PencilIcon className="absolute p-4 z-5 text-zinc-200 group-hover:text-zinc-400 opacity-50 group-hover:opacity-100" />
        )}
        {isUploading && (
          <div className="flex w-full h-full justify-center items-center">
            <LoadingSpinnerNoBounds />
          </div>
        )}
      </div>
    </div>
  );
};
export default Icon;
