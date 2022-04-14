import UserResult from "../../search/components/UserResult";
const AllUsers: React.FC<{}> = (props) => {
  return (
    <div className="pt-28 px-5 bg-zinc-900 min-h-screen">
      <div className="space-y-5 animate-fade">
        <h1 className="text-zinc-200">All Users</h1>
        <UserResult />
        <UserResult />
        <UserResult />
      </div>
    </div>
  );
};
export default AllUsers;
