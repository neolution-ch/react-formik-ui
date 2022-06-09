import * as React from "react";
import { useField, useFormikContext } from "formik";

import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import Col from "reactstrap/lib/Col";
import FormFeedback from "reactstrap/lib/FormFeedback";
import { PropsWithChildren } from "react";

import { InputFieldProps } from "./InputFieldProps";
import { InputFieldInternal } from "./InputFieldInternal";

/**
 * Input Field component to render any kind of text input element.
 */
function InputField<T>(props: PropsWithChildren<InputFieldProps<T>>) {
  const {
    name,
    type = "text",
    label = name as string,
    id,
    validation,
    parseValueAs = "string",
    numberFormatConfig,
    fieldOnly = false,
  } = props;

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

  const input = (
    <InputFieldInternal
      {...props}
      field={field}
      valid={valid}
      invalid={invalid}
      stringName={stringName}
      initialVal={initialVal}
      setFieldValue={setFieldValue}
      parseValueAs={parseValueAs}
    ></InputFieldInternal>
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
