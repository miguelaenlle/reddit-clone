import { UploadIcon } from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import { StringLiteralLike } from "typescript";
import { imageCSS } from "../constants/image-class";
import LightButton from "./LightButton";
const DragAndDrop: React.FC<{
  id: string;
  imageId: string;
  isLoading: boolean;
  touched: boolean | undefined;
  error: string | undefined;
  isIcon: boolean;
  dragText: string;
  uploadFile: (file: File | null) => void;
}> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      props.uploadFile(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result) {
        setPreviewUrl(fileReader.result as string);
        props.uploadFile(file);
      }
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const handleClicked = () => {
    if (filePickerRef) {
      if (filePickerRef.current) {
        filePickerRef.current.click();
      }
    }
  };
  const handlePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.isLoading) {
      if (event.target.files && event.target.files.length === 1) {
        const pickedFile = event.target.files[0];
        const newName = `${props.imageId}$-${props.id}`;
        const newFile = new File([pickedFile], newName);
        setFile(newFile);
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };
  const handleRemove = () => {
    if (!props.isLoading) {
      setFile(null);
      setPreviewUrl(null);
    }
  };
  return (
    <React.Fragment>
      <input
        className={"hidden"}
        ref={filePickerRef}
        type="file"
        id={props.id}
        accept=".jpg,.png,.jpeg"
        onChange={handlePicked}
      />
      <LightButton
        onClick={handleClicked}
        buttonImage={<UploadIcon className={imageCSS} />}
        buttonText={props.dragText}
      />
      {previewUrl && (
        <div className="relative">
          <img
            onClick={handleRemove}
            className={`${
              !props.isLoading ? "hover:cursor-pointer" : ""
            } z-0 object-cover ${
              !props.isIcon ? "w-full" : "w-24 rounded-full"
            } h-24 border ${
              props.isLoading ? "opacity-50" : ""
            } border-zinc-700 hover:border-zinc-400 hover:border-2`}
            src={previewUrl}
            alt="Preview"
          />
        </div>
      )}
      {props.error && props.touched && (
        <p className="text-red-500 text-md">{props.error}</p>
      )}
    </React.Fragment>
  );
};
export default DragAndDrop;
