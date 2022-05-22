import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "@heroicons/react/outline";
import ImageCounter from "./ImageCounter";
import LeftRightIcon from "./LeftRightIcon";
import XMarkButton from "./XMarkButton";

const ImageUpload: React.FC<{
  uploadedImages: { imageUrl: string; number: number }[];
  selectedImage: number | undefined;
  handleImageSelected: (newSelectedImage: number) => void;
  handleImageUploaded: (file: File | null) => void;
  removeNumber: (number: number) => void;
  handleMoveImageLeft: (number: number) => void;
  handleMoveImageRight: (number: number) => void;
}> = (props) => {
  return (
    <div
      className={`overflow-x-auto py-2 scrollbar-track-black scrollbar-thumb-slate-600 flex ${
        props.uploadedImages.length > 0 ? "space-x-2" : ""
      }`}
    >
      {props.uploadedImages
        .sort((a, b) => a.number - b.number)
        .map((imageData) => {
          const imageNumber = imageData.number;
          const imageSelected = imageNumber === props.selectedImage;
          return (
            <div className="relative">
              <div className="absolute z-10">
                <ImageCounter
                  light={false}
                  imageNumber={imageNumber}
                  totalImages={props.uploadedImages.length}
                />
              </div>

              <div className="hover:cursor-pointer group absolute z-10 top-0 right-0 p-2">
                <XMarkButton
                  handleClick={() => {
                    props.removeNumber(imageNumber);
                  }}
                />
              </div>
              {imageSelected && (
                <div className="flex absolute z-9 top-0 right-0 w-full h-fulls items-center">
                  <div className="w-full flex px-2">
                    <LeftRightIcon
                      light={false}
                      left={true}
                      handleClick={() => {
                        props.handleMoveImageLeft(imageNumber);
                      }}
                    />
                    <div className="flex-grow"></div>
                    <LeftRightIcon
                      light={false}
                      left={false}
                      handleClick={() => {
                        props.handleMoveImageRight(imageNumber);
                      }}
                    />
                  </div>
                </div>
              )}
              <img
                onClick={() => {
                  props.handleImageSelected(imageNumber);
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
  );
};
export default ImageUpload;
