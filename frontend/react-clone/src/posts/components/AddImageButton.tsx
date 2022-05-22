import { PhotographIcon } from "@heroicons/react/solid";
import React, { useRef } from "react";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

const AddImageButton: React.FC<{
  isLoading: boolean;
  handleImageUploaded: (image: File | null) => void;
}> = (props) => {
  const filePickerRef = useRef<HTMLInputElement>(null);
  const handlePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];
      const newFile = new File([pickedFile], pickedFile.name);
      props.handleImageUploaded(newFile);
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
    <React.Fragment>
      <input
        className={"hidden"}
        ref={filePickerRef}
        type="file"
        id={"file-picker"}
        accept=".jpg,.png,.jpeg"
        onChange={handlePicked}
      />
      <div
        onClick={handleClicked}
        className="w-fit p-2 group hover:cursor-pointer border-2 border-zinc-700"
      >
        {props.isLoading ? (
          <div className="flex space-x-0 items-center px-2">
            <LoadingSpinner />
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <p className=" text-zinc-500 group-hover:text-zinc-400 whitespace-nowrap">
              Add Image
            </p>
            <PhotographIcon className="text-zinc-500 group-hover:text-zinc-400 w-7 h-7" />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default AddImageButton;
