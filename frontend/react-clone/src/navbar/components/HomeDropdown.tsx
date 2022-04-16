import { useEffect, useState } from "react";
import {
  optionIds,
  pageOptionIcons,
  pageOptionValues,
  urlValues,
  urlToValue
} from "../constants/page-options";
import { useHistory, useLocation } from "react-router-dom";
import Dropdown from "../../shared/components/Dropdown";

const HomeDropdown: React.FC<{}> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("home");

  const initializeLocation = () => {
    const url = location.pathname;
    const value = urlToValue[url];
    if (value) {
      setSelectedOption(value);
    }
  }

  useEffect(() => {
    initializeLocation();

  }, [])

  const handleSelectedOption = (option: string) => {
    setSelectedOption(option);
    history.push(urlValues[option]);
  };

  return (
    <Dropdown
      navbar={true}
      optionIds={optionIds}
      optionValues={pageOptionValues}
      optionIcons={pageOptionIcons}
      selectedOption={selectedOption}
      handleSelectedOption={handleSelectedOption}
    />
  );
};
export default HomeDropdown;
