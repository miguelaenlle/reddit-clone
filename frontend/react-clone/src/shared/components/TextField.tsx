
const TextField: React.FC<{
  fieldType: string;
  name: string;
  placeholder: string;
  touched: boolean | undefined;
  error: string | undefined;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}> = (props) => {
  return (
    <div>
      <input
        className={`w-full px-3 py-1.5 bg-zinc-700 border ${(props.error && props.touched) ? "border-red-500" : "border-zinc-600"}`}
        placeholder={props.placeholder}
        id={props.name}
        name={props.name}
        type={props.fieldType}
        onBlur={props.onBlur}
        onChange={props.onChange}
        value={props.value}
      />
      {props.touched && props.error ? (
        <div className="mt-1 mb-1 text-red-500">{props.error}</div>
      ) : null}
    </div>
  );
};
export default TextField;
