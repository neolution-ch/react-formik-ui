import { FormikProps, Formik, Form, FormikConfig } from "formik";
import * as React from "react";

interface FormikWrapperProps<T> extends FormikConfig<T> {
  children?: ((props: FormikProps<T>) => React.ReactNode) | React.ReactNode;
}

function FormikWrapper<T>(props: FormikWrapperProps<T>) {
  const { children, initialValues, onSubmit, ...rest } = props;

  function isFunction(fn: any) {
    return fn && {}.toString.call(fn) === "[object Function]";
  }

  function cleanInitialValus(item: T): T {
    Object.keys(item).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      if (item[key] === undefined) item[key] = "";
    });

    return item;
  }

  function cleanSubmitValues(item: T): T {
    Object.keys(item).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      if (item[key] === "") delete item[key];
    });

    return item;
  }

  // const cleanedInitialValues =

  return (
    <React.Fragment>
      <Formik<T>
        {...rest}
        initialValues={cleanInitialValus(initialValues)}
        onSubmit={(values, helpers) => {
          onSubmit(cleanSubmitValues(values), helpers);
        }}
      >
        {(formProps) => (
          <Form>{isFunction(children) ? (children as (props: FormikProps<T>) => React.ReactNode)(formProps) : children}</Form>
        )}
      </Formik>
    </React.Fragment>
  );
}

export { FormikWrapper, FormikWrapperProps };
