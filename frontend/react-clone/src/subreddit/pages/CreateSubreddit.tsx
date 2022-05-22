import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import DragAndDrop from "../../shared/components/DragAndDrop";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";
import { imageCSS } from "../../shared/constants/image-class";
import { v4 as uuidv4 } from "uuid";
import { urlValues } from "../../navbar/constants/page-options";
import Masonry from "react-masonry-css";

const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

  const validatorRegex = /^[a-zA-Z0-9-_]+$/;

  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length < 6) {
    errors.name = "Must be 6 characters or more";
  } else if (values.name.length > 30) {
    errors.name = "Must be 30 characters or less";
  } else if (values.name.includes(" ")) {
    errors.name = "Subreddit name must have no spaces";
  } else if (`${values.name.toLowerCase()}` !== values.name) {
    errors.name = "Subreddit name must be lowercase";
  } else if (values.name.search(validatorRegex) === -1) {
    errors.name =
      "Subreddit name must only contain letters, numbers, dashes, and/or underscores";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description.length < 10) {
    errors.description = "Description must be 10+ characters long";
  } else if (values.description.length > 300) {
    errors.description = "Description must be under 300 characters long";
  }

  if (!values.icon) {
    errors.icon = "Required";
  } else if (values.icon.length === 0) {
    errors.icon = "Required";
  }

  if (!values.banner) {
    errors.banner = "Required";
  } else if (values.banner.length === 0) {
    errors.banner = "Required";
  }

  return errors;
};

const CreateSubreddit: React.FC = (props) => {
  const history = useHistory();

  const [imageId, setImageId] = useState(uuidv4());

  useEffect(() => {
    setImageId(uuidv4());
  }, []);

  const authContext = useContext(AuthContext);
  const httpClient = useHttpClient();

  const [icon, setIcon] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [displayedError, setDisplayedError] = useState<string | null>(null);

  const updateError = (newError: string | null) => {
    setDisplayedError(newError);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      icon: "",
      banner: "",
    },
    validate,
    onSubmit: (values) => {
      handleCreateSubreddit();
    },
  });

  const handleCreateSubreddit = async () => {
    if (!icon || !banner) {
      setDisplayedError("Please upload an icon and a banner");
      return;
    }
    setDisplayedError(null);
    const url = `${process.env.REACT_APP_BACKEND_URL}/subreddits`;
    try {
      const formData = new FormData();
      formData.append("subName", formik.values.name);
      formData.append("description", formik.values.description);
      formData.append("icon", icon);
      formData.append("banner", banner);

      const token = authContext?.token;
      if (token) {
        const responseData = await httpClient.sendFormDataRequest(
          url,
          "POST",
          formData,
          token
        );

        if (responseData.error !== "OK") {
          updateError(responseData.error);
        } else {
          const subredditID = responseData.data.data.sub_id;
          const url = `/sub/${subredditID}`;
          history.push(url);
        }
      } else {
        updateError("You must be logged in to create a subreddit");
      }
    } catch (error: any) {
      if (error.message) {
        updateError(error.message);
      }
    }
  };

  const uploadIconFile = (file: File | null) => {
    setIcon(file);
    if (file) {
      formik.setFieldValue("icon", file, true);
    } else {
      formik.setFieldValue("icon", "", true);
    }
  };
  const uploadBannerFile = (file: File | null) => {
    setBanner(file);
    if (file) {
      formik.setFieldValue("banner", file, true);
    } else {
      formik.setFieldValue("banner", "", true);
    }
  };

  return (
    <Modal confirmLeave={true}>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Create a Subreddit</h1>
        <div className="mt-5 relative">
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            <TextField
              fieldType="name"
              name="name"
              placeholder="Subreddit Name"
              touched={formik.touched.name}
              error={formik.errors.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <InputField
              name="description"
              placeholder="Description"
              touched={formik.touched.description}
              error={formik.errors.description}
              value={formik.values.description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <DragAndDrop
              id="icon"
              imageId={imageId}
              isLoading={httpClient.isLoading}
              touched={formik.touched.icon}
              error={formik.errors.icon}
              isIcon={true}
              dragText={"Click to upload icon"}
              uploadFile={uploadIconFile}
            />
            <DragAndDrop
              id="banner"
              imageId={imageId}
              isLoading={httpClient.isLoading}
              touched={formik.touched.banner}
              error={formik.errors.banner}
              isIcon={false}
              dragText={"Click to upload banner"}
              uploadFile={uploadBannerFile}
            />
            <br />
            {displayedError && (
              <p className="text-red-500 text-lg">{displayedError}</p>
            )}
            <div className="flex">
              <div className="grow"></div>
              <LightButton
                loading={httpClient.isLoading}
                submit={true}
                buttonImage={<ArrowRightIcon className={imageCSS} />}
                buttonText="Create Subreddit"
              />
            </div>
            <br />
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default CreateSubreddit;
