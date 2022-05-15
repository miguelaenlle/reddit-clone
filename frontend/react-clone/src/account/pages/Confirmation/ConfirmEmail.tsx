import { ArrowRightIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import LightButton from "../../../shared/components/LightButton";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import Modal from "../../../shared/components/Modal";
import { useLocation } from "react-router-dom";
import { useHttpClient } from "../../../hooks/http-hook";
import { imageCSS } from "../../../shared/constants/image-class";

const ConfirmEmail: React.FC<{}> = (props) => {
  const location = useLocation();
  const httpClient = useHttpClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const handleError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  const getAuthToken = () => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    return token;
  };

  const signinToken = async (token: string) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/auth/confirm-email`;
      const requestBody = {
        verificationToken: token,
      };

      const response = await httpClient.sendRequest(url, "POST", requestBody);
      setIsLoading(false);
      setVerified(true);
    } catch (error: any) {
      if (error.message as string) {
        handleError(error.message);
      }
    }
  };

  const authenticateToken = async () => {
    const token = getAuthToken();
    if (!token) {
      handleError("Please provide a valid token");
    } else {
      await signinToken(token);
    }
  };

  useEffect(() => {
    authenticateToken();
  }, []);

  const history = useHistory();

  const state: any = location.state;
  const background = state && state.background;

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
      <h1 className="text-2xl text-white mb-5">
        Email verification {verified ? "succeeded" : error ? "failed" : ""}
      </h1>
      {isLoading && (
        <p className="flex items-center text-lg text-zinc-300">
          <LoadingSpinner /> Verifying your email...
        </p>
      )}
      {error && (
        <p className="text-lg text-red-500">
          {error}
          <br />
        </p>
      )}
      {verified && (
        <p className="text-lg text-zinc-300">
          You may now log into your account.
        </p>
      )}
      <div className="mt-5">
        {!isLoading && (
          <LightButton
            onClick={handleLogin}
            buttonImage={<ArrowRightIcon className={imageCSS} />}
            buttonText={"Go back to login"}
          />
        )}
      </div>
    </div>
  );
};
export default ConfirmEmail;
