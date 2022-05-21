import DragAndDrop from "../../shared/components/DragAndDrop";
import { PhotographIcon } from "@heroicons/react/solid";
import AddImageButton from "./AddImageButton";
import React, { useState } from "react";

const UploadImages: React.FC<{}> = (props) => {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    { imageUrl: string; number: number }[]
  >([]);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<
    { file: File; number: number }[]
  >([]);

  const [selectedImage, setSelectedImage] = useState<number | undefined>();

  const handleImageSelected = (newSelectedImage: number) => {
    setSelectedImage(newSelectedImage);
  };

  const handleImageUploaded = (file: File | null) => {
    if (file) {
      setIsLoading(true);
      console.log(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result && file) {
          const newImage = {
            imageUrl: fileReader.result as string,
            number: uploadedImages.length + 1,
          };
          if (uploadedImageFiles.length === 0) {
              setSelectedImage(1);
          }
          setUploadedImages((prevImages) => [...prevImages, newImage]);
          setUploadedImageFiles((prev) => [
            ...prev,
            {
              file,
              number: prev.length + 1,
            },
          ]);

        } else {
          setError("Error uploading file. Please try again");
        }
        setIsLoading(false);
      };
      fileReader.readAsDataURL(file);
    } else {
      setError("No file selected. Please upload a file.");
    }
  };

  return (
    <React.Fragment>
      <div
        className={`overflow-x-auto py-2 scrollbar-track-black scrollbar-thumb-slate-600 flex ${
          uploadedImages.length > 0 ? "space-x-2" : ""
        }`}
      >
        {uploadedImages
          .sort((a, b) => a.number - b.number)
          .map((imageData) => {
            return (
              <div className="relative">
                <div className="m-2 px-5 py-2 bg-zinc-700 bg-opacity-50 rounded-lg absolute z-10 w-fit">
                  <p>
                    {imageData.number}/{uploadedImages.length}
                  </p>
                </div>

                <img
                  onClick={() => {
                    handleImageSelected(imageData.number);
                  }} // set selected image
                  className={`z-5 h-52 max-w-2xl rounded-sm object-cover border-2 ${
                    selectedImage === imageData.number ? "border-zinc-400" : "border-zinc-700"
                  }`}
                  src={imageData.imageUrl}
                  alt="Preview"
                />
              </div>
            );
          })}
      </div>
      <AddImageButton
        handleImageUploaded={handleImageUploaded}
        isLoading={isLoading}
      />

      {error && <p className="text-red-500 text">{error}</p>}
    </React.Fragment>
  );
};
export default UploadImages;
