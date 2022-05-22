export const generateImageUrl = (baseImageURL: string) => {
  const BASE_BACKGROUND_URL = process.env.REACT_APP_STORAGE_URL;
  const imageUrl = `${BASE_BACKGROUND_URL}/${baseImageURL}`.replaceAll(
    "%",
    "%25"
  );
  return imageUrl;
};
