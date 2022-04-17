import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useState } from "react";
import LightButton from "../../shared/components/LightButton";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";

import { Link } from "react-router-dom";

import { imageCSS } from "../../shared/constants/image-class";


const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length < 6) {
    errors.username = "Must be 6 characters or more";
  } else if (values.username.includes(" ")) {
    errors.username = "Username must have no spaces";
  } else if (values.username.toLowerCase() !== values.username) {
    errors.username = "Username must be lowercase";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 6) {
    errors.password = "Must be 6+ characters";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};



const Signup: React.FC<{}> = (props) => {
  const handleDismiss = () => {};

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
    },
  });
  return (
    <Modal onDismiss={handleDismiss}>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Create Account</h1>
        <div className="mt-5 relative">
          <form className="space-y-2" onSubmit={formik.handleSubmit}>
            <TextField
              fieldType="text"
              name="username"
              placeholder="Username"
              touched={formik.touched.username}
              error={formik.errors.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.username}
            />

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

            <TextField
              fieldType="password"
              name="password"
              placeholder="Password"
              touched={formik.touched.password}
              error={formik.errors.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />

            <br />

            <Link to="/login">
              <p className="group hover:text-white text-zinc-400 hover:cursor-pointer">
                Log In
              </p>
            </Link>

            <Link to="/reset-password">
              <p className="group hover:text-white text-zinc-400 hover:cursor-pointer">
                Reset password
              </p>
            </Link>

            <br />
            <LightButton
              buttonImage={<ArrowRightIcon className={imageCSS} />}
              buttonText="Create Account"
            />
            <br />
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default Signup;
