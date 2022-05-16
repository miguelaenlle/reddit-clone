import { ArrowRightIcon, RefreshIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useHttpClient } from "../../../hooks/http-hook";
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
  const httpClient = useHttpClient();
  const history = useHistory();

  const [error, setError] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [lastPasswordReset, setLastPasswordReset] = useState<Date | null>(null);
  const [resent, setResent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (resent) {
      const timeout = setTimeout(() => {
        setResent(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [resent]);

  const handleGoBack = () => {
    history.goBack();
  };

  const sendPasswordReset = async () => {
    setError(null);
    const email = formik.values.email;

    const requestBody = {
      email,
    };

    try {
      if (
        !lastPasswordReset ||
        lastPasswordReset < new Date(Date.now() - 60 * 1000)
      ) {
        const url = `${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`;
        const result = await httpClient.sendRequest(url, "POST", requestBody);
        setEmailSentTo(email);
      } else {
        setError("Please wait a minute before trying again.");
      }
    } catch (error: any) {
      if (error) {
        setError(error.message);
      }
    }
  };

  const resendResetPassword = async () => {
    setError(null);
    const requestBody = {
      email: emailSentTo,
    };
    try {
      if (
        !lastPasswordReset ||
        lastPasswordReset < new Date(Date.now() - 60 * 1000)
      ) {
        const url = `${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`;
        const result = await httpClient.sendRequest(url, "POST", requestBody);
        setLastPasswordReset(new Date());
        setResent(true);
      } else {
        setError("Please wait a minute before trying again.");
      }
    } catch (error: any) {
      if (error) {
        setError(error.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: (values) => {
      sendPasswordReset();
    },
  });

  return (
    <Modal>
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
            {error && <div className="text-red-500 text-md pt-4">{error}</div>}
            {emailSentTo ? (
              <React.Fragment>
                {resent ? (
                  <p className="animate-fade text-zinc-200">
                    An email was successfully resent to{" "}
                    <span className="text-zinc-400">{emailSentTo}</span>
                  </p>
                ) : (
                  <p className="animate-fade text-zinc-200">
                    Click the link sent to{" "}
                    <span className="text-zinc-400">{emailSentTo}</span> to
                    verify your email.
                  </p>
                )}
                <LightButton
                  onClick={resendResetPassword}
                  loading={httpClient.isLoading}
                  buttonImage={<RefreshIcon className={imageCSS} />}
                  buttonText="Resend Reset Email"
                />
              </React.Fragment>
            ) : (
              <LightButton
                submit={true}
                loading={httpClient.isLoading}
                buttonImage={<ArrowRightIcon className={imageCSS} />}
                buttonText="Send Reset Email"
              />
            )}
          </form>
        </div>

        <p
          className="mt-5 group hover:text-white text-zinc-400 hover:cursor-pointer"
          onClick={handleGoBack}
        >
          Go back to login
        </p>
      </div>
    </Modal>
  );
};
export default RequestResetPassword;
