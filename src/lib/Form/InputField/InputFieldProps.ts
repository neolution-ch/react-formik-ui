import { FieldValidator } from "formik/dist/types";
import { ReactDatePickerProps } from "react-datepicker";
import { NumberFormatProps } from "react-number-format";
import { InputType } from "reactstrap/lib/Input";

interface InputFieldProps<T> {
  /** The name of the input. This is what formik will map to. */
  name: keyof T;
  /** The label for the input. Default: name */
  label?: string;
  /** The type of the input according to the normal HTML Input specifications */
  type?: InputType;
  /** The id of the input */
  id?: string;
  /** Mutable ref object to the input */
  innerRef?: React.MutableRefObject<any>;
  /** On Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** On Blur handler */
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Whether the input should be disabled */
  disabled?: boolean;
  /** Placeholder of the input */
  placeholder?: string;
  /** Custom Validation function. Return error message string or undefined for success */
  validation?: FieldValidator;
  /** Autocomplete attribute according to the HTML specifications */
  autoComplete?: string;
  /** Parse value explcitly, useful for example for selects using which is a number  */
  parseValueAs?: "string" | "number" | "boolean" | ((value: string) => any);
  /** Whether the inpust should be multiple selectable (only valid for select) */
  multiple?: boolean;
  /** Number format config for the  */
  numberFormatConfig?: NumberFormatProps;
  /** Render only the field without a label (defaults to false) */
  fieldOnly?: boolean;
  /** The config for the react date picker: https://www.npmjs.com/package/react-datepicker */
  datePickerConfig?: Omit<ReactDatePickerProps, "onChange">;
}

export { InputFieldProps };
