import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";
import DragAndDrop from "../../shared/components/DragAndDrop";
import { imageCSS } from "../../shared/constants/image-class";
import { checkPrime } from "crypto";

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
    errors.name = "Subreddit name must only contain letters, numbers, dashes, and/or underscores";

  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description.length < 10) {
    errors.description = "Description must be 10+ characters long";
  }else if (values.description.length > 300) {
    errors.description = "Description must be under 300 characters long";
  }


  return errors;
};

const CreateSubreddit: React.FC<{}> = (props) => {
  const handleDismiss = () => {};

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validate,
    onSubmit: (values) => {
    },
  });

  return (
    <Modal onDismiss={handleDismiss}>
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
            <DragAndDrop dragText={"Drag & drop banner"} />
            <DragAndDrop dragText={"Drag & drop icon"} />
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
export default CreateSubreddit;
