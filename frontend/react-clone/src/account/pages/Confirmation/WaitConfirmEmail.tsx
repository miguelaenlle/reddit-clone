import { ArrowRightIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import LightButton from "../../../shared/components/LightButton";
import Modal from "../../../shared/components/Modal";
import { imageCSS } from "../../../shared/constants/image-class";

const WaitConfirmEmail: React.FC<{}> = (props) => {
  const handleDismiss = () => {};
  const resendEmail = () => {};

  return (
    <Modal>
      <div className="mt-20 p-5 mx-auto max-w-4xl w/80 bg-zinc-800 border border-zinc-700 text-white">
        <h1 className="text-2xl text-white">Verify your email</h1>
        <p className="text-lg text-zinc-300">
            A link was sent to bot.developer3@gmail.com. Click the verification link to verify your email.
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
export default WaitConfirmEmail;
