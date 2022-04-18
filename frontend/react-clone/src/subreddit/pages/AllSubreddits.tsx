import SubredditResult from "../../search/components/SubredditResult";
const AllSubreddits: React.FC<{}> = (props) => {
  return (
    <div className="pt-14 bg-zinc-900 min-h-screen">
      <div className="p-5">
        <div className="pt-10 z-0 animate-fade relative">
          <div className="space-y-5 animate-fade mb-20">
            <h1 className="text-white text-xl">My Subreddits</h1>
          </div>
          <div className="space-y-5 animate-fade">
            <h1 className="text-white text-xl ">All Subreddits</h1>
            

          </div>
        </div>
      </div>
    </div>
  );
};
export default AllSubreddits;
