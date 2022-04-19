import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";
import DragAndDrop from "../../shared/components/DragAndDrop";
import { imageCSS } from "../../shared/constants/image-class";
import DropdownTextField from "../components/DropdownTextField";

const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

  if (!values.title) {
    errors.title = "Required";
  } else if (values.title.length > 70) {
    errors.title = "Must be 70 characters or less";
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
  const [selectedOption, setSelectedOption] = useState("");
  const handleDismiss = () => {};
  const handleSelectedOption = (option: string) => {
    formik.setFieldValue("subreddit", option, true);
    setSelectedOption(option);
  };

  const formik = useFormik({
    initialValues: {
      subreddit: "",
      title: "",
      text: "",
    },
    validate,
    onSubmit: (values) => {
    },
  });

  return (
    <Modal >
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Create a Post</h1>
        <div className="mt-5 relative">
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            <DropdownTextField
              selectedOption={selectedOption}
              touched={formik.touched.subreddit}
              handleSelectedOption={handleSelectedOption}
              error={formik.errors.subreddit}
              onBlur={formik.handleBlur}
            />
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
            <DragAndDrop dragText={"Drag & drop post images or"} />
            <br />
            <div className="flex">
              <div className="grow"></div>
              <LightButton
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
export default CreatePost;
