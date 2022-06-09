/* eslint-disable max-lines */
/* eslint-disable complexity */
import * as React from "react";
import { useField, useFormikContext } from "formik";

import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import Input, { InputProps } from "reactstrap/lib/Input";
import Col from "reactstrap/lib/Col";
import FormFeedback from "reactstrap/lib/FormFeedback";
import { PropsWithChildren } from "react";

import NumberFormat, { NumberFormatProps } from "react-number-format";

import DatePicker from "react-datepicker";
import { InputFieldProps } from "./InputFieldProps";

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
  datePickerConfig,
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
    throw Error(`Number Format config only works together with input type text, tel or passowrd. Field: "${stringName}"`);
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

  const getInput = () => {
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
            render
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
  };

  const input = getInput();

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
