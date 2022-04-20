import { ArrowRightIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useHttpClient } from "../../../hooks/http-hook";
import LightButton from "../../../shared/components/LightButton";
import Modal from "../../../shared/components/Modal";
import TextField from "../../../shared/components/TextField";
import { imageCSS } from "../../../shared/constants/image-class";

const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};

  if (!values.newPassword) {
    errors.newPassword = "Required";
  } else if (values.newPassword.length < 6) {
    errors.newPassword = "Must be 6+ characters";
  }

  return errors;
};
const ResetPassword: React.FC<{}> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const httpClient = useHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    validate,
    onSubmit: (values) => {
      handleSubmit();
    },
  });

  const handleError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  const getResetToken = () => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const userId = query.get("userId");
    return { token, userId };
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, userId } = getResetToken();
      if (!token || !userId) {
        setError("Invalid URL. Please check that you have the right link.");
        setIsLoading(false);
        return;
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/auth/change-password`;
      const newPassword = formik.values.newPassword;
      const requestBody = {
        userId,
        newPassword,
        forgotPasswordToken: token,
      };
      const responseData = await httpClient.sendRequest(
        url,
        "POST",
        requestBody
      );
      console.log(responseData.ok);
      setIsLoading(false);
      setVerified(true);
      console.log(responseData);
    } catch (error: any) {
      if (error.message) {
        handleError(error.message);
      }
    }
  };
  const handleLogin = () => {
    history.push({
      pathname: "/login",
      state: {
        background: location,
      },
    });
  };

  return (
    <div className="pt-28 px-5 bg-zinc-900 min-h-screen">
      <h1 className="text-2xl text-white">Reset Password</h1>

      <div className="mt-5 relative">
        <form className="space-y-2" onSubmit={formik.handleSubmit}>
          {verified ? (
            <React.Fragment>
              <p className="text-zinc-300">
                Password reset successful. You may now log in.
              </p>
              <div className="h-3"></div>

              <LightButton
                onClick={handleLogin}
                buttonImage={<ArrowRightIcon className={imageCSS} />}
                buttonText="Go to log in"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
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
              <div className="h-0"></div>

              <LightButton
                submit={true}
                loading={isLoading}
                buttonImage={<ArrowRightIcon className={imageCSS} />}
                buttonText="Reset Password"
              />
              <p
                onClick={handleLogin}
                className="pt-5 group hover:text-white text-zinc-400 hover:cursor-pointer"
              >
                Go back to login
              </p>
            </React.Fragment>
          )}

          {error && (
            <p className="text-md text-red-500">
              {error}
              <br />
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
