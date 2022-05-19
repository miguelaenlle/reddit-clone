import Feed from "../components/Feed";
const Homepage: React.FC<{}> = (props) => {
  return (
    <>
      <div className="bg-zinc-900 min-h-screen">
        <Feed />
      </div>
    </>
  );
};
export default Homepage;
