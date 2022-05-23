/* eslint-disable complexity */
import * as React from "react";
import { useField, FieldValidator, useFormikContext } from "formik";

import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import Input, { InputProps, InputType } from "reactstrap/lib/Input";
import Col from "reactstrap/lib/Col";
import FormFeedback from "reactstrap/lib/FormFeedback";
import { PropsWithChildren } from "react";

import NumberFormat, { NumberFormatProps } from "react-number-format";

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
  /** Rener only the field without a label (defaults to false) */
  fieldOnly?: boolean;
}

/**
 * Input Field component to render any kind of text input element.
 */
function InputField<T>({
  name,
  type = "text",
  label = name as string,
  id,
  innerRef,
  disabled = undefined,
  onChange,
  onBlur,
  placeholder,
  validation,
  autoComplete,
  children,
  multiple,
  parseValueAs = "string",
  numberFormatConfig,
  fieldOnly = false,
}: PropsWithChildren<InputFieldProps<T>>) {
  const pathArr = (name as string).replace(/"/g, "").replace(/\[/g, ".").replace(/\]/g, "").split(".");
  const stringName = pathArr.join(".");
  const { setFieldValue, initialValues } = useFormikContext<T>();
  const [field, meta] = useField({
    name: stringName,
    validate: validation,
  });

  const valid = meta.touched && !meta.error;
  const invalid = meta.touched && !!meta.error;
  const initialVal = pathArr.reduce((obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined), initialValues);

  if (type === "checkbox" && typeof initialVal !== "boolean") {
    throw Error(`Please supply a boolean initial Value for a checkbox. Field: "${stringName}", Value:"${initialVal}"`);
  }

  if (numberFormatConfig && !["text", "tel", "password"].includes(type)) {
    throw Error(`Number Format config only works together with input type text,tel or passowrd. Field: "${stringName}"`);
  }

  const commonInputProps: NumberFormatProps<InputProps> & InputProps = {
    ...field,
    name: stringName,
    valid,
    invalid,
    id: id ?? stringName,
    innerRef,
    disabled,
    placeholder,
    autoComplete,
    multiple,
    onBlur: (e) => {
      if (onBlur) onBlur(e);
    },
    defaultChecked: type === "checkbox" ? initialVal : undefined,
  };

  const input = numberFormatConfig ? (
    <NumberFormat<InputProps>
      {...commonInputProps}
      {...numberFormatConfig}
      onValueChange={(values, sourceInfo) => {
        setFieldValue(field.name, values.floatValue);

        if (onChange) {
          onChange(sourceInfo.event);
        }
      }}
      onChange={() => {
        // left intionally blank. We need to override it to make sure the built in
        // onChange coming from {...field} isn't fired.
      }}
      customInput={Input}
    />
  ) : (
    <Input
      {...commonInputProps}
      type={type}
      onChange={(e) => {
        switch (parseValueAs) {
          default:
            setFieldValue(field.name, parseValueAs(e.target.value));
            break;
          case "boolean":
            setFieldValue(field.name, !!e.target.value);
            break;
          case "string":
            field.onChange(e);
            break;
          case "number":
            if (type === "select" && multiple) {
              setFieldValue(
                field.name,
                Array.from((e as any as React.ChangeEvent<HTMLSelectElement>).target.selectedOptions, (option) => +option.value),
              );
            } else {
              setFieldValue(field.name, +e.target.value);
            }
            break;
        }

        if (onChange) {
          onChange(e);
        }
      }}
    >
      {children}
    </Input>
  );

  return (
    <React.Fragment>
      {fieldOnly ? (
        <React.Fragment>{input}</React.Fragment>
      ) : (
        <FormGroup row>
          <Label for={id ?? stringName} sm={6}>
            {label}
          </Label>
          <Col sm={6}>{input}</Col>
          <Col sm={{ size: 6, offset: 6 }}>{meta.touched && meta.error && <FormFeedback>{meta.error}</FormFeedback>}</Col>
        </FormGroup>
      )}
    </React.Fragment>
  );
}

export { InputField, InputFieldProps };
