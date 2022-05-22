import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "@heroicons/react/outline";

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
              <div className="m-2 px-5 py-2 bg-zinc-700 bg-opacity-50 rounded-lg absolute z-10 w-fit">
                <p>
                  {imageNumber}/{props.uploadedImages.length}
                </p>
              </div>

              <div className="hover:cursor-pointer group absolute z-10 top-0 right-0 p-2">
                <div
                  onClick={() => {
                    props.removeNumber(imageNumber);
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
                        props.handleMoveImageLeft(imageNumber);
                      }}
                      className=" bg-zinc-700 p-1 bg-opacity-50 hover:bg-opacity-100 hover:cursor-pointer rounded-lg"
                    >
                      <ChevronLeftIcon className="h-5" />
                    </div>
                    <div className="flex-grow"></div>
                    <div
                      onClick={() => {
                        props.handleMoveImageRight(imageNumber);
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
