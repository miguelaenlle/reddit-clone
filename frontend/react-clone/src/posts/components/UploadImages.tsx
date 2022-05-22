import DragAndDrop from "../../shared/components/DragAndDrop";
import { PhotographIcon } from "@heroicons/react/solid";
import AddImageButton from "./AddImageButton";
import React, { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "@heroicons/react/outline";
import ImageUpload from "./ImageUpload";

const UploadImages: React.FC<{
  handleImagesChange: (images: { file: File; number: number }[]) => void;
}> = (props) => {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    { imageUrl: string; number: number }[]
  >([]);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<
    { file: File; number: number }[]
  >([]);

  const [selectedImage, setSelectedImage] = useState<number | undefined>();

  useEffect(() => {
    props.handleImagesChange(uploadedImageFiles);
  }, [uploadedImageFiles]);

  const handleImageSelected = (newSelectedImage: number) => {
    setSelectedImage(newSelectedImage);
  };

  const handleImageUploaded = (file: File | null) => {
    if (file) {
      setIsLoading(true);
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
      <ImageUpload
        uploadedImages={uploadedImages}
        selectedImage={selectedImage}
        handleImageUploaded={handleImageUploaded}
        handleImageSelected={handleImageSelected}
        removeNumber={removeNumber}
        handleMoveImageLeft={handleMoveImageLeft}
        handleMoveImageRight={handleMoveImageRight}
      />

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
