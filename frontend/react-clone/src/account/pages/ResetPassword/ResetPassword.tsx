import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import LightButton from "../../../shared/components/LightButton";
import Modal from "../../../shared/components/Modal";
import TextField from "../../../shared/components/TextField";
import { imageCSS } from "../../../shared/constants/image-class";

const validate = (values: { [key: string]: string }) => {
  console.log(values);
  const errors: { [key: string]: string } = {};

  if (!values.newPassword) {
    errors.newPassword = "Required";
  } else if (values.newPassword.length < 6) {
    errors.newPassword = "Must be 6+ characters";
  }

  return errors;
};
const ResetPassword: React.FC<{}> = (props) => {
  const handleDismiss = () => {};

  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    validate,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <Modal onDismiss={handleDismiss}>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Reset Password</h1>

        <div className="mt-5 relative">
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            <TextField
              fieldType="password"
              name="newPassword"
              placeholder="New Password"
              touched={formik.touched.newPassword}
              error={formik.errors.newPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.newPassword}
            />
            <div className="h-6"></div>
            <Link to="/login">
              <p className="group hover:text-white text-zinc-400 hover:cursor-pointer">
                Cancel
              </p>
            </Link>

            <LightButton
              buttonImage={<ArrowRightIcon className={imageCSS} />}
              buttonText="Reset Password"
            />
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default ResetPassword;
