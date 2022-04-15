import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import InputField from "../../shared/components/InputField";
import LightButton from "../../shared/components/LightButton";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";
import DragAndDrop from "../../shared/components/DragAndDrop";
import { imageCSS } from "../../shared/constants/image-class";

const validate = (values: { [key: string]: string }) => {
  console.log(values);
  const errors: { [key: string]: string } = {};

  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length < 6) {
    errors.name = "Name must be 6+ characters long";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description.length < 10) {
    errors.description = "Description must be 10+ characters long";
  }

  console.log(errors);

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
      console.log(values);
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
              placeholder="Title"
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
