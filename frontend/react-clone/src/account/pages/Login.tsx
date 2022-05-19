import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import LightButton from "../../shared/components/LightButton";
import Modal from "../../shared/components/Modal";
import TextField from "../../shared/components/TextField";
import { imageCSS } from "../../shared/constants/image-class";
import EmailVerification from "../components/EmailVerification";

const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

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

const INVALID_EMAIL_ERROR_MESSAGE = "Please validate your email.";

const Login: React.FC<{}> = (props) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();
  const httpClient = useHttpClient();

  const [displayedError, setDisplayedError] = useState<string | null>(null);

  const updateDisplayedError = (error: string | null) => {
    setDisplayedError(error);
  };

  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      signinUser();
    },
  });

  const signinUser = async () => {
    setDisplayedError(null);
    const email = formik.values.email;
    const password = formik.values.password;

    const requestBody = {
      email,
      password,
    };

    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;

    try {
      const signinResponse = await httpClient.sendRequest(
        url,
        "POST",
        requestBody
      );
      // check if the user is not verified

      authContext?.login(
        signinResponse.username,
        signinResponse.id,
        signinResponse.token,
        null
      );
      history.push("/home");
    } catch (error: any) {
      if (error) {
        if (error.message === INVALID_EMAIL_ERROR_MESSAGE) {
          setEmailSentTo(requestBody.email);
        }
        setDisplayedError(error.message);
      }
    }
  };

  const state: any = location.state;
  const background = state && state.background;

  const handleCreateAccount = () => {
    history.push({
      pathname: "/signup",
      state: {
        background: background,
      },
    });
  };

  const handleResetPassword = () => {
    history.push({
      pathname: "/reset-password",
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
        <h1 className="text-2xl text-white">Log In</h1>
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

            {displayedError && (
              <p className="text-red-500 text-md">{displayedError}</p>
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
                buttonText="Log in"
              />
            )}
            <br />

            <br />
          </form>
          <p
            onClick={handleCreateAccount}
            className="group hover:text-white text-zinc-400 hover:cursor-pointer"
          >
            Create account instead
          </p>
          <p
            onClick={handleResetPassword}
            className="group hover:text-white text-zinc-400 hover:cursor-pointer"
          >
            Reset password
          </p>
        </div>
      </div>
    </Modal>
  );
};
export default Login; //
