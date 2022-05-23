import React from "react";
import { Story, Meta } from "@storybook/react";

import { Form, Formik } from "formik";
import { Button, Col, Row } from "reactstrap";
import { InputField, InputFieldProps } from "../src/lib/Form/InputField/InputField";

type T = {
  firstName: string;
};

export default {
  title: "formik-ui/InputField",
  component: InputField,
  args: {
    name: "firstName",
  },
} as Meta;

const Template: Story<InputFieldProps<T>> = (args) => (
  <React.Fragment>
    <Formik
      initialValues={{
        firstName: "",
      }}
      onSubmit={(values) => {
        // eslint-disable-next-line no-alert
        alert(JSON.stringify(values));
      }}
    >
      <Form>
        <Row>
          <Col lg={3}>
            <InputField {...args} />
            <Button color="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Formik>
  </React.Fragment>
);

export const Basic = Template.bind({});

export const CustomValidation = Template.bind({});
CustomValidation.args = {
  validation: (value: string) => {
    if (value.length < 5) return "too short, add more";
    if (value.length > 10) return "too long...";
    return undefined;
  },
} as InputFieldProps<T>;
CustomValidation.decorators = [
  (StoryComponent: any) => (
    <React.Fragment>
      <p>The field has to have the length between 5 and 10</p>
      <StoryComponent />
    </React.Fragment>
  ),
];

export const CustomLabel = Template.bind({});
CustomLabel.args = {
  label: "custom Label",
} as InputFieldProps<T>;

export const InputType = Template.bind({});
InputType.args = {
  type: "number",
} as InputFieldProps<T>;
