import Navbar from "../components/Navbar";

const HeaderWrapper: React.FC<{}> = (props) => {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
};
export default HeaderWrapper;
