import DragAndDrop from "../../shared/components/DragAndDrop";
import { PhotographIcon } from "@heroicons/react/solid";
import AddImageButton from "./AddImageButton";
import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "@heroicons/react/outline";

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

  const removeNumber = (number: number) => {
    setUploadedImages((prevImages) => {
      const newImages = prevImages.filter((image) => image.number !== number);
      // for every image with a number greater than the number to be deleted, decrement the number
      const newImagesWithDecrementedNumbers = newImages.map((image) => {
        if (image.number > number) {
          return { ...image, number: image.number - 1 };
        } else {
          return image;
        }
      });
      return newImagesWithDecrementedNumbers;
    });

    setUploadedImageFiles((prevImages) => {
      const newImages = prevImages.filter((image) => image.number !== number);
      // for every image with a number greater than the number to be deleted, decrement the number
      const newImagesWithDecrementedNumbers = newImages.map((image) => {
        if (image.number > number) {
          return { ...image, number: image.number - 1 };
        } else {
          return image;
        }
      });
      return newImagesWithDecrementedNumbers;
    });
  };

  const handleMoveImageLeft = (number: number) => {
    if (number > 1) {
      setUploadedImages((prevImages) => {
        const newImages = prevImages.map((image) => {
          if (image.number === number) {
            return { ...image, number: image.number - 1 };
          } else if (image.number === number - 1) {
            return { ...image, number: image.number + 1 };
          } else {
            return image;
          }
        });
        return newImages;
      });
      setUploadedImageFiles((prevImages) => {
        const newImages = prevImages.map((image) => {
          if (image.number === number) {
            return { ...image, number: image.number - 1 };
          } else if (image.number === number - 1) {
            return { ...image, number: image.number + 1 };
          } else {
            return image;
          }
        });
        return newImages;
      });
      setSelectedImage(number - 1);
    }
  };

  const handleMoveImageRight = (number: number) => {
    if (number < uploadedImages.length) {
      setUploadedImages((prevImages) => {
        const newImages = prevImages.map((image) => {
          if (image.number === number) {
            return { ...image, number: image.number + 1 };
          } else if (image.number === number + 1) {
            return { ...image, number: image.number - 1 };
          } else {
            return image;
          }
        });
        return newImages;
      });
      setUploadedImageFiles((prevImages) => {
        const newImages = prevImages.map((image) => {
          if (image.number === number) {
            return { ...image, number: image.number + 1 };
          } else if (image.number === number + 1) {
            return { ...image, number: image.number - 1 };
          } else {
            return image;
          }
        });
        return newImages;
      });
      setSelectedImage(number + 1);
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
            const imageNumber = imageData.number;
            const imageSelected = imageNumber === selectedImage;
            return (
              <div className="relative">
                <div className="m-2 px-5 py-2 bg-zinc-700 bg-opacity-50 rounded-lg absolute z-10 w-fit">
                  <p>
                    {imageNumber}/{uploadedImages.length}
                  </p>
                </div>

                <div className="hover:cursor-pointer group absolute z-10 top-0 right-0 p-2">
                  <div
                    onClick={() => {
                      removeNumber(imageNumber);
                    }}
                    className={`flex items-center space-x-1 bg-zinc-700 bg-opacity-50 hover:bg-opacity-100 rounded-lg p-1`}
                  >
                    <XIcon className="h-5 group-hover:text-zinc-200" />
                  </div>
                </div>
                {imageSelected && (
                  <div className="flex absolute z-9 top-0 right-0 w-full h-full items-center">
                    <div className="w-full flex px-2">
                      <div
                        onClick={() => {
                          handleMoveImageLeft(imageNumber);
                        }}
                        className=" bg-zinc-700 p-1 bg-opacity-50 hover:bg-opacity-100 hover:cursor-pointer rounded-lg"
                      >
                        <ChevronLeftIcon className="h-5" />
                      </div>
                      <div className="flex-grow"></div>
                      <div
                        onClick={() => {
                            handleMoveImageRight(imageNumber);
                        }}
                        className="bg-zinc-700 p-1 bg-opacity-50 hover:bg-opacity-100 hover:cursor-pointer rounded-lg"
                      >
                        <ChevronRightIcon className="h-5" />
                      </div>
                    </div>
                  </div>
                )}
                <img
                  onClick={() => {
                    handleImageSelected(imageNumber);
                  }} // set selected image
                  className={`z-5 h-52 max-w-2xl min-w-xl rounded-sm object-cover border-2 ${
                    imageSelected ? "border-zinc-400" : "border-zinc-700"
                  }`}
                  src={imageData.imageUrl}
                  alt="Preview"
                />
              </div>
            );
          })}
      </div>
      {uploadedImages.length < 10 && (
        <AddImageButton
          handleImageUploaded={handleImageUploaded}
          isLoading={isLoading}
        />
      )}
      {uploadedImages.length > 0 && (
        <p
          className={
            uploadedImages.length < 10 ? "text-zinc-400" : "text-red-500"
          }
        >
          {uploadedImages.length} images
        </p>
      )}

      {error && <p className="text-red-500 text">{error}</p>}
    </React.Fragment>
  );
};
export default UploadImages;
