import React, { useEffect, useState } from "react";
import { Post } from "../../models/Post";
import ImageCounter from "../../posts/components/ImageCounter";
import LeftRightIcon from "../../posts/components/LeftRightIcon";
import { generateImageUrl } from "../helpers/generate-image-url";

const ImagePreview: React.FC<{ post: Post }> = (props) => {
  const images = props.post.imageURLs;
  const [selectedImage, setSelectedImage] = useState<number | undefined>();

  useEffect(() => {
    console.log(images);
    if (images.length > 0) {
      setSelectedImage(1);
    }
  }, []);

  return (
    <div className="relative">
      {selectedImage && (
        <React.Fragment>
          <img
            className="w-full object-cover"
            src={generateImageUrl(images[selectedImage - 1])}
          />
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
                    setSelectedImage((prevImage) =>
                      prevImage ? prevImage - 1 : prevImage
                    );
                  }}
                />
              )}
              <div className="flex-grow"></div>
              {selectedImage < images.length && (
                <LeftRightIcon
                  light={true}
                  left={false}
                  handleClick={() => {
                    setSelectedImage((prevImage) =>
                      prevImage ? prevImage + 1 : prevImage
                    );
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
