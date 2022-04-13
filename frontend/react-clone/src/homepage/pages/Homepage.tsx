import { Outlet } from "react-router-dom";
import Feed from "../components/Feed";
const Homepage: React.FC<{}> = (props) => {
  return (
    <>
      <div className="bg-zinc-900 min-h-screen">
        <Feed />
      </div>
      <Outlet />
    </>
  );
};
export default Homepage;
