import React, { useEffect, useState } from "react";
import { Post } from "../../models/Post";
import ImageCounter from "../../posts/components/ImageCounter";
import LeftRightIcon from "../../posts/components/LeftRightIcon";
import { generateImageUrl } from "../helpers/generate-image-url";
import LoadingSpinner from "./LoadingSpinner";

const ImagePreview: React.FC<{ post: Post; handleUpdateLayout: () => void }> = (
  props
) => {
  const images = props.post.imageURLs;
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | undefined>();

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(1);
    }
  }, []);

  const handleImageMove = (left: boolean) => {
    setSelectedImage((prevImage) =>
      prevImage ? prevImage - (left ? 1 : -1) : prevImage
    );
    setImageLoading(true);
  };

  const handleEndLoad = () => {
    setImageLoading(false);
    props.handleUpdateLayout();
  };

  return (
    <div className="relative border border-zinc-700">
      {selectedImage && (
        <React.Fragment>
          <img
            className="w-full object-cover"
            src={generateImageUrl(images[selectedImage - 1])}
            onLoad={() => {
              handleEndLoad();
            }}
          />
          {imageLoading && (
            <div className="flex absolute z-20 top-0 left-0 w-full h-full bg-black bg-opacity-60 items-center justify-center">
              <div className="flex items-center">
                <LoadingSpinner />
                <p className="text-zinc-200">Loading...</p>
              </div>
            </div>
          )}
          <div className="absolute top-0 left-0.5">
            <ImageCounter
              light={true}
              imageNumber={selectedImage}
              totalImages={images.length}
            />
          </div>

          <div className="flex absolute z-9 top-0 right-0 w-full h-full items-center">
            <div className="w-full flex px-2">
              {selectedImage > 1 && (
                <LeftRightIcon
                  light={true}
                  left={true}
                  handleClick={() => {
                    handleImageMove(true);
                  }}
                />
              )}
              <div className="flex-grow"></div>
              {selectedImage < images.length && (
                <LeftRightIcon
                  light={true}
                  left={false}
                  handleClick={() => {
                    handleImageMove(false);
                  }}
                />
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
export default ImagePreview;
