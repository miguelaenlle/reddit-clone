import { PencilIcon } from "@heroicons/react/outline";
import LightButton from "../../shared/components/LightButton";

const UserHeader: React.FC<{}> = (props) => {
  return (
    <div>
      <div className="bg-blue-500 h-40 z-0"></div>

      <div className="items-start space-x-5 flex p-5 bg-zinc-800 border-y border-zinc-700">
        <div>
          <div className="group flex hover:cursor-pointer justify-center items-center group h-24 w-24 bg-white border-4 hover:border-zinc-400 border-zinc-200 rounded-full">
            <PencilIcon className="text-zinc-200 group-hover:text-zinc-400 w-12 pb-0.5" />
          </div>
        </div>
        <div>
          <div className="items-center flex space-x-3">
            <h1 className="text-white text-2xl">u/n_exus</h1>
          </div>
          <h1 className="mt-2 text-zinc-400 text-lg">50,000 karma</h1>
        </div>
      </div>
    </div>
  );
};
export default UserHeader;
