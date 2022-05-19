import { ArrowRightIcon, RefreshIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import React, { FormEvent, useEffect, useState } from "react";
import LightButton from "../../shared/components/LightButton";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";

import { Link, useHistory, useLocation } from "react-router-dom";

import { imageCSS } from "../../shared/constants/image-class";
import { useHttpClient } from "../../hooks/http-hook";
import EmailVerification from "../components/EmailVerification";

const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

  const validatorRegex = /^[a-zA-Z0-9-_]+$/;

  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length < 6) {
    errors.username = "Must be 6 characters or more";
  } else if (values.username.includes(" ")) {
    errors.username = "Username must have no spaces";
  } else if (values.username.toLowerCase() !== values.username) {
    errors.username = "Username must be lowercase";
  } else if (values.username.search(validatorRegex) === -1) {
    errors.username =
      "Username must only contain letters, numbers, dashes, and/or underscores";
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
  const history = useHistory();
  const location = useLocation();

  const httpClient = useHttpClient();
  const [displayedError, setDisplayedError] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);

  const updateDisplayedError = (error: string | null) => {
    setDisplayedError(error);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      signupUser();
    },
  });

  const signupUser = async () => {
    setDisplayedError(null);
    setEmailSentTo(null);

    const username = formik.values.username;
    const email = formik.values.email;
    const password = formik.values.password;

    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/signup`;
    const requestBody = {
      username,
      email,
      password,
    };

    try {
      const signupResult = await httpClient.sendRequest(
        url,
        "POST",
        requestBody
      );
      setEmailSentTo(signupResult.user.email);
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage) {
        setDisplayedError(errorMessage);
      }
    }

  };

  const state: any = location.state;
  const background = state && state.background;

  const handleLogin = () => {
    history.push({
      pathname: "/login",
      state: {
        background: background,
      },
    });
  };
  const handleEndConfirm = () => {
    setDisplayedError(null);
    setEmailSentTo(null);
  };

  return (
    <Modal>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Create Account</h1>
        <p className="text-lg text-zinc-400">To post or create subreddits on redddit, create an account first!</p>
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
            <div className="pt-5 space-y-3">
              {displayedError && (
                <div className="text-red-500 text-md">{displayedError}</div>
              )}

              {emailSentTo ? (
                <React.Fragment>
                  <EmailVerification
                    emailSentTo={emailSentTo}
                    updateDisplayedError={updateDisplayedError}
                  />
                  <p
                    onClick={handleEndConfirm}
                    className="group hover:text-white text-zinc-400 hover:cursor-pointer"
                  >
                    Cancel
                  </p>
                </React.Fragment>
              ) : (
                <LightButton
                  submit={true}
                  loading={httpClient.isLoading}
                  buttonImage={<ArrowRightIcon className={imageCSS} />}
                  buttonText="Create Account"
                />
              )}

              <br />
              <p
                onClick={handleLogin}
                className="hover:text-white text-zinc-400 hover:cursor-pointer"
              >
                Log in instead
              </p>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default Signup;
