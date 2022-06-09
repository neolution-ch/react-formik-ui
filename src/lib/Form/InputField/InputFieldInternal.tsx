import { FieldInputProps } from "formik/dist/types";
import { PropsWithChildren } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import Input, { InputProps } from "reactstrap/lib/Input";
import { InputFieldProps } from "./InputFieldProps";
import DatePicker from "react-datepicker";

interface InputFieldInternalProps<T> extends PropsWithChildren<InputFieldProps<T>> {
  valid: boolean;
  invalid: boolean;
  stringName: string;
  field: FieldInputProps<any>;
  initialVal: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  parseValueAs: "string" | "number" | "boolean" | ((value: string) => any);
}

function InputFieldInternal<T>(props: InputFieldInternalProps<T>) {
  const {
    placeholder,
    disabled = undefined,
    autoComplete,
    multiple,
    innerRef,
    valid,
    invalid,
    stringName,
    field,
    id,
    onBlur,
    initialVal,
    type,
    numberFormatConfig,
    parseValueAs,
    setFieldValue,
    onChange,
    children,
    datePickerConfig,
  } = props;

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

  const extendedType = numberFormatConfig ? "number-with-format" : type;
  switch (extendedType) {
    default:
      return (
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

    case "date":
      return (
        <>
          <DatePicker
            {...(commonInputProps as any)}
            selected={field.value}
            dateFormat="dd.MM.yyyy"
            {...datePickerConfig}
            onChange={(date) => setFieldValue(field.name, date)}
          ></DatePicker>
        </>
      );

    case "number-with-format":
      return (
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
      );
  }
}

export { InputFieldInternal };
