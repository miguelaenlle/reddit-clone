const SearchTypeSelector: React.FC<{
  selectedOptionId: string;
  handleSelectOption: (optionId: string) => void;
  optionIds: string[];
  optionValues: { [key: string]: string };
}> = (props) => {
  return (
    <div className="flex space-x-4 mb-10">
      {props.optionIds.map((optionId) => {
        return (
          <div
            key={`search-option-${optionId}`}
            onClick={() => {
              props.handleSelectOption(optionId);
            }}
            className="hover:cursor-pointer"
          >
            <h3
              className={`${
                optionId === props.selectedOptionId
                  ? "text-white"
                  : "text-zinc-400"
              } text-xl transition-colors`}
            >
              {props.optionValues[optionId]}
            </h3>
          </div>
        );
      })}
    </div>
  );
};
export default SearchTypeSelector;
