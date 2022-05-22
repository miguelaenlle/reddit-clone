import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import { Subreddit } from "../../models/Subreddit";
import SearchBar from "../../navbar/components/SearchBar";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";
import { imageCSS } from "../../shared/constants/image-class";
import { AuthContext } from "../../context/auth-context";
import UploadImages from "../components/UploadImages";

const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

  if (!values.title) {
    errors.title = "Required";
  } else if (values.title.length > 40) {
    errors.title = "Must be 40 characters or less";
  } else if (values.title.length < 6) {
    errors.title = "Must be 6 characters or more";
  }

  if (values.text && values.text.length > 3000) {
    errors.text = "Must be 3000 characters or less";
  }
  if (!values.subreddit) {
    errors.subreddit = "Required";
  }

  return errors;
};

const CreatePost: React.FC<{}> = (props) => {
  const authContext = useContext(AuthContext);
  const location: any = useLocation();
  const history = useHistory();
  const httpClient = useHttpClient();
  const [selectedOption, setSelectedOption] = useState("");
  const [loadingSubreddit, setLoadingSubreddit] = useState(false);

  const [uploadedImageFiles, setUploadedImageFiles] = useState<
    { file: File; number: number }[]
  >([]);

  const handleSubmit = async (values: { [key: string]: string }) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/posts`;

    const inputData = {
      subId: values.subreddit,
      title: values.title,
      text: values.text,
    };
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("text", values.text);
      formData.append("subId", values.subreddit);
      for (const file of uploadedImageFiles.sort(
        (a, b) => a.number - b.number
      )) {
        formData.append("images", file.file);
      }

      const response = await httpClient.sendFormDataRequest(
        url,
        "POST",
        formData,
        authContext?.token
      );
      const responseData = response.data;

      const postId = responseData.id;
      history.push({
        pathname: `/post/${postId}`,
        state: {
          background: location.state.background,
        },
      });

      window.location.reload();
      // redirect to the post location
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      subreddit: "",
      title: "",
      text: "",
    },
    validate,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    initializePreselectedSubreddit();
  }, [location.search]);

  const initializePreselectedSubreddit = async () => {
    const queryParams = new URLSearchParams(location.search);
    const subId = queryParams.get("subId");
    if (subId) {
      setLoadingSubreddit(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits/${subId}`;
      try {
        const response = await httpClient.sendRequest(url, "GET");
        const subredditData = response.data;
        const subredditItem = new Subreddit(
          subredditData.name,
          subredditData._id,
          subredditData.sub_owner,
          subredditData.num_members,
          subredditData.description,
          subredditData.background_image_url,
          subredditData.picture_url
        );
        setSelectedOption(subredditItem.subName);
        formik.setFieldValue("subreddit", subredditItem.subId);
      } catch (error) {}
      setLoadingSubreddit(false);
    }
  };

  const handleImagesChange = (images: { file: File; number: number }[]) => {
    setUploadedImageFiles(images);
  };

  return (
    <Modal confirmLeave={true}>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Create a Post</h1>
        <div className="mt-5 relative">
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            {/* <DropdownTextField
              selectedOption={selectedOption}
              touched={formik.touched.subreddit}
              handleSelectedOption={handleSelectedOption}
              error={formik.errors.subreddit}
              onBlur={formik.handleBlur}
            />
             */}
            {loadingSubreddit ? (
              <div className="flex space-x-0 items-center p-3">
                <LoadingSpinner />
                <p className="text-zinc-200">Loading subreddits</p>
              </div>
            ) : (
              <React.Fragment>
                <SearchBar
                  isCompact={true}
                  displayedValue={selectedOption}
                  handleSelectResult={(name: string, subId: string) => {
                    formik.setFieldValue("subreddit", subId, true);
                    setSelectedOption(name);
                  }}
                />
                <p
                  className={`flex items-center w-full border ${
                    formik.errors.subreddit
                      ? "border-red-500"
                      : "border-zinc-700"
                  } space-x-0.5 h-10 bg-transparent text-zinc-200 placeholder-zinc-400 px-3 selected:border-1`}
                >
                  <span className="text-zinc-400">Selected Subreddit: r/</span>
                  <span>{selectedOption}</span>
                </p>
                {formik.errors.subreddit && (
                  <p className="text-red-500 text">{formik.errors.subreddit}</p>
                )}
              </React.Fragment>
            )}
            <TextField
              fieldType="text"
              name="title"
              placeholder="Title"
              touched={formik.touched.title}
              error={formik.errors.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            <InputField
              name="text"
              placeholder="Text"
              touched={formik.touched.text}
              error={formik.errors.text}
              value={formik.values.text}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <UploadImages handleImagesChange={handleImagesChange} />
            <br />
            <div className="flex">
              <div className="grow"></div>
              <LightButton
                submit={true}
                loading={httpClient.isLoading}
                buttonImage={<ArrowRightIcon className={imageCSS} />}
                buttonText="Create Post"
              />
            </div>
            <br />
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default CreatePost;
