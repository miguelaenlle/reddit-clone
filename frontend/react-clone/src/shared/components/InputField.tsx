
const InputField: React.FC<{
    name: string;
    placeholder: string;
    touched: boolean | undefined;
    error: string | undefined;
    value: string;
    onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }> = (props) => {
    return (
      <div>
        <textarea
          className={`w-full px-3 py-1.5 bg-zinc-700 text-zinc-200 border ${(props.error && props.touched) ? "border-red-500" : "border-zinc-600"}`}
          placeholder={props.placeholder}
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
        {props.touched && props.error ? (
          <div className="mt-1 mb-1 text-red-500">{props.error}</div>
        ) : null}
      </div>
    );
  };
  export default InputField;
  