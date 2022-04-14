import { Link } from "react-router-dom";

const UserResult: React.FC<{}> = (props) => {
  return (
    <div className="flex p-5 bg-zinc-800 border border-zinc-700 items-center">
      <div>
        <div className="w-10 h-10 rounded-full bg-zinc-200 mr-5"></div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <Link to = "/user/userID">
            <h2 className="hover:cursor-pointer hover:text-white hover:underline text-zinc-200 text-xl">
              {"u/n_exus"}
            </h2>
          </Link>
          <h2 className="text-zinc-400"> •</h2>
          <h2 className="text-zinc-400 text-md">{"5,000 upvotes"}</h2>
        </div>
      </div>
    </div>
  );
};
export default UserResult;
