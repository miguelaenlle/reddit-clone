import { ArrowRightIcon } from "@heroicons/react/outline";
import { Link, useNavigate } from "react-router-dom";
import LightButton from "../../../shared/components/LightButton";
import Modal from "../../../shared/components/Modal";
import { imageCSS } from "../../../shared/constants/image-class";

const WaitResetPassword: React.FC<{}> = (props) => {
  const handleDismiss = () => {};
  const navigate = useNavigate();

  const resendEmail = () => {};

  return (
    <Modal onDismiss={handleDismiss}>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Reset Password</h1>
        <p className="text-lg text-zinc-300">
          A password reset link was sent to ________. Click the link to reset
          your password then log in.
        </p>

        <div className="mt-5 relative">
          <div className="h-6"></div>
          <p
            className="group hover:text-white text-zinc-400 hover:cursor-pointer"
            onClick={resendEmail}
          >
            Resend Email
          </p>

          <div className="h-3"></div>
          <Link to="/login">
            <LightButton
              buttonImage={<ArrowRightIcon className={imageCSS} />}
              buttonText="Back to Login"
            />
          </Link>
        </div>
      </div>
    </Modal>
  );
};
export default WaitResetPassword;
