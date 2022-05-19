import { RefreshIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import LightButton from "../../shared/components/LightButton";
import { imageCSS } from "../../shared/constants/image-class";

const EmailVerification: React.FC<{
  emailSentTo: string | null;
  updateDisplayedError: (error: string | null) => void;
}> = (props) => {
  const httpClient = useHttpClient();

  const [resent, setResent] = useState(false);
  const [lastResend, setLastResend] = useState<Date | null>(null);

  useEffect(() => {
    if (resent) {
      const timeout = setTimeout(() => {
        setResent(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [resent]);

  const resendVerificationEmail = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/resend-email`;
    const requestBody = {
      email: props.emailSentTo,
    };

    try {
      if (!lastResend || lastResend < new Date(Date.now() - 60 * 1000)) {
        setLastResend(new Date());
        const resendResult = await httpClient.sendRequest(
          url,
          "POST",
          requestBody
        );
        setResent(true);
      } else {
        props.updateDisplayedError(
          "Please wait a minute before resending your email."
        );
      }
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage) {
        props.updateDisplayedError(errorMessage);
      }
    }
  };

  return (
    <div className="space-y-3">
      {resent ? (
        <p className="animate-fade text-zinc-200">
          An email was successfully resent to{" "}
          <span className="text-zinc-400">{props.emailSentTo}</span>
        </p>
      ) : (
        <p className="animate-fade text-zinc-200">
          Click the link sent to{" "}
          <span className="text-zinc-400">{props.emailSentTo}</span> to verify
          your email.
        </p>
      )}

      <LightButton
        loading={httpClient.isLoading}
        buttonImage={<RefreshIcon className={imageCSS} />}
        onClick={() => {
          resendVerificationEmail();
        }}
        buttonText="Resend Email"
      />
    </div>
  );
};
export default EmailVerification;
