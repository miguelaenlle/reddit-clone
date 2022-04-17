import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import LightButton from "../../../shared/components/LightButton";
import Modal from "../../../shared/components/Modal";
import TextField from "../../../shared/components/TextField";
import { imageCSS } from "../../../shared/constants/image-class";



const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};
const RequestResetPassword: React.FC<{}> = (props) => {
  const handleDismiss = () => {};
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: (values) => {
    },
  });

  return (
    <Modal onDismiss={handleDismiss}>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Reset Password</h1>

        <div className="mt-5 relative">
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            <TextField
              fieldType="email"
              name="email"
              placeholder="Email"
              touched={formik.touched.email}
              error={formik.errors.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <div className="h-6"></div>
            <p
              className="group hover:text-white text-zinc-400 hover:cursor-pointer"
              onClick={handleGoBack}
            >
              Go back
            </p>

            <LightButton
              buttonImage={<ArrowRightIcon className={imageCSS} />}
              buttonText="Send Reset Email"
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default RequestResetPassword;
