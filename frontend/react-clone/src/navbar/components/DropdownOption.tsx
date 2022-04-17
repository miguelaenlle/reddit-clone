const DropdownOption: React.FC<{
  optionId: string;
  optionIcon?: React.ReactElement;
  optionText: string;
  selectedOption: string;
  handleSelectedOption: (option: string) => void;
}> = (props) => {
  const selected = props.selectedOption === props.optionId;
  const handleClick = () => {
    props.handleSelectedOption(props.optionId);
  };
  return (
    <li
      onMouseDown={handleClick}
      className="group space-x-2 flex items-center py-1 px-3 hover:cursor-pointer"
    >
      {props.optionIcon && props.optionIcon}
      <p
        className={`grow ${
          selected ? "text-white" : "text-zinc-400"
        } group-hover:text-white pr-10 transition-colors`}
      >
        {props.optionText}
      </p>
    </li>
  );
};
export default DropdownOption;
