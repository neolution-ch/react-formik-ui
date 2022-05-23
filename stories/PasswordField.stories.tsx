import React from "react";
import { Story, Meta } from "@storybook/react";

import { Form, Formik } from "formik";
import { Button, Col, Row } from "reactstrap";
import { PasswordField, PasswordFieldProps } from "../src/lib/Form/PasswordField/PasswordField";

export default {
  title: "formik-ui/PasswordField",
  component: PasswordField,
  args: {
    name: "password",
  } as PasswordFieldProps,
} as Meta;

const Template: Story<PasswordFieldProps> = (args) => (
  <React.Fragment>
    <Formik
      initialValues={{
        password: "",
        "password-confirm": "",
      }}
      onSubmit={(values) => {
        // eslint-disable-next-line no-alert
        alert(JSON.stringify(values));
      }}
    >
      <Form>
        <Row>
          <Col lg={3}>
            <PasswordField {...args} />
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

export const CustomLabel = Template.bind({});
CustomLabel.args = {
  label: "custom Label",
} as PasswordFieldProps;

export const CustomTranslations = Template.bind({});
CustomTranslations.args = {
  label: "custom Label",
  customTranslations: {
    errorRequired: "Custom Input is mandatory",
    errorPasswordComplexity: "Custom Password lenght must be between 8 and 40 characters",
    errorPasswordComplexityCharacters: "Custom The password must contain at least 1 uppercase, 1 lowercase character and 1 digit.",
    errorPasswordsAreNotIdentical: "Custom The passwords are not identical",
  },
} as PasswordFieldProps;

CustomTranslations.decorators = [
  (StoryComponent: any) => (
    <React.Fragment>
      <p>You can also change the translations globally by using the setTranslations method...</p>
      <StoryComponent />
    </React.Fragment>
  ),
];

export const ConfirmExample = Template.bind({});
ConfirmExample.args = {
  confirmFieldName: "password-confirm",
} as PasswordFieldProps;
