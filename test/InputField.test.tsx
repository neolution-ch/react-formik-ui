/* eslint-disable max-lines */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { Button } from "reactstrap/lib";
import { NumberFormatProps } from "react-number-format";
import { FormikWrapper, InputField } from "src";

function nameOf<T>(key: keyof T): keyof T {
  return key;
}

const options = (
  <React.Fragment>
    <option value="">Please Choose</option>
    <option value="1">one</option>
    <option value="2">two</option>
    <option value="3">three</option>
  </React.Fragment>
);

describe("<InputField />", () => {
  // snapshot test
  test("renders correctly", () => {
    const { container } = render(
      <FormikWrapper initialValues={{ test: "" }} onSubmit={() => console.log("submit")}>
        <InputField name="test" autoComplete="off" disabled label="My Label" placeholder="placeholder" id="id" type="number" />
      </FormikWrapper>,
    );
    // The snapshot content is left out for this example.
    // It will automatically be generated and added to this file the first time the tests are run.
    expect(container.firstChild).toMatchInlineSnapshot(`
      <form
        action="#"
      >
        <div
          class="row form-group"
        >
          <label
            class="col-sm-6 col-form-label"
            for="id"
          >
            My Label
          </label>
          <div
            class="col-sm-6"
          >
            <input
              aria-invalid="false"
              autocomplete="off"
              class="form-control"
              disabled=""
              id="id"
              name="test"
              placeholder="placeholder"
              type="number"
              value=""
            />
          </div>
          <div
            class="col-sm-6 offset-sm-6"
          />
        </div>
      </form>
    `);
  });

  function setup<T>(initialValues: T, form?: React.ReactNode) {
    const onSubmit = jest.fn();

    const utils = render(
      <FormikWrapper<T> initialValues={initialValues} onSubmit={onSubmit}>
        {form}

        <Button type="submit">Submit</Button>
      </FormikWrapper>,
    );

    return { onSubmit, ...utils };
  }

  test("string input", async () => {
    interface T {
      stringInput: string;
      stringInput2: string;
      stringInput3?: string;
    }

    const form = (
      <React.Fragment>
        <InputField<T> name="stringInput" />
        <InputField<T> name="stringInput2" />
        <InputField<T> name="stringInput3" />
      </React.Fragment>
    );

    const { onSubmit, container } = setup<T>(
      {
        stringInput: "",
        stringInput2: "Doe",
        stringInput3: "Hi",
      },
      form,
    );

    userEvent.type(container.querySelector("#stringInput") as HTMLElement, "John");
    userEvent.clear(container.querySelector("#stringInput3") as HTMLElement);
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    const expectedResult: T = {
      stringInput: "John",
      stringInput2: "Doe",
      stringInput3: undefined,
    };

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expectedResult, expect.anything()));
  });

  test("number input", async () => {
    interface T {
      numberInput?: number;
      numberInput2: number;
      numberInput3?: number;
    }

    const form = (
      <React.Fragment>
        <InputField<T> name="numberInput" type="number" />
        <InputField<T> name="numberInput2" type="number" />
        <InputField<T> name="numberInput3" type="number" />
      </React.Fragment>
    );

    const { onSubmit, container } = setup<T>(
      {
        numberInput: undefined,
        numberInput2: 42,
        numberInput3: 42,
      },
      form,
    );

    userEvent.type(container.querySelector("#numberInput") as HTMLElement, "50");
    userEvent.clear(container.querySelector("#numberInput3") as HTMLElement);
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    const expectedResult: T = {
      numberInput: 50,
      numberInput2: 42,
      numberInput3: undefined,
    };

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expectedResult, expect.anything()));
  });

  test("select input", async () => {
    interface T {
      selectInput?: number;
      selectInput2: number;
      selectInput3?: string;
      selectInput4: string;
      multipleSelectString: string[];
      multipleSelectString2: string[];
      multipleSelectNumber: number[];
      multipleSelectNumber2: number[];
    }

    const form = (
      <React.Fragment>
        <InputField<T> name="selectInput" type="select" parseValueAs="number">
          {options}
        </InputField>
        <InputField<T> name="selectInput2" type="select" parseValueAs="number">
          {options}
        </InputField>
        <InputField<T> name="selectInput3" type="select">
          {options}
        </InputField>
        <InputField<T> name="selectInput4" type="select">
          {options}
        </InputField>

        <InputField<T> name="multipleSelectString" type="select" multiple>
          {options}
        </InputField>
        <InputField<T> name="multipleSelectString2" type="select" multiple>
          {options}
        </InputField>

        <InputField<T> name="multipleSelectNumber" type="select" multiple parseValueAs="number">
          {options}
        </InputField>
        <InputField<T> name="multipleSelectNumber2" type="select" multiple parseValueAs="number">
          {options}
        </InputField>
      </React.Fragment>
    );

    const { onSubmit, container } = setup<T>(
      {
        selectInput2: 2,
        selectInput4: "",
        multipleSelectString: [],
        multipleSelectString2: [],
        multipleSelectNumber: [],
        multipleSelectNumber2: [],
      },
      form,
    );

    fireEvent.change(container.querySelector("#selectInput") as HTMLElement, { target: { value: "3" } });
    fireEvent.change(container.querySelector("#selectInput3") as HTMLElement, { target: { value: "2" } });
    fireEvent.change(container.querySelector("#selectInput3") as HTMLElement, { target: { value: "" } });
    fireEvent.change(container.querySelector("#selectInput4") as HTMLElement, { target: { value: "2" } });

    userEvent.selectOptions(container.querySelector("#multipleSelectString") as HTMLElement, ["1", "3"]);
    userEvent.selectOptions(container.querySelector("#multipleSelectString2") as HTMLElement, ["1", "3"]);
    userEvent.deselectOptions(container.querySelector("#multipleSelectString2") as HTMLElement, ["1", "3"]);

    userEvent.selectOptions(container.querySelector("#multipleSelectNumber") as HTMLElement, ["1", "3"]);
    userEvent.selectOptions(container.querySelector("#multipleSelectNumber2") as HTMLElement, ["1", "3"]);
    userEvent.deselectOptions(container.querySelector("#multipleSelectNumber2") as HTMLElement, ["1", "3"]);

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    const expectedResult: T = {
      selectInput: 3,
      selectInput2: 2,
      selectInput4: "2",
      multipleSelectString: ["1", "3"],
      multipleSelectString2: [],
      multipleSelectNumber: [1, 3],
      multipleSelectNumber2: [],
    };

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expectedResult, expect.anything()));
  });

  test("validated input", async () => {
    interface T {
      validatedInput?: string;
    }

    const onChange = jest.fn();
    const correctInput = "secret";
    const errorMessage = "invalid";

    const form = (
      <React.Fragment>
        <InputField<T>
          name="validatedInput"
          validation={(value) => (value === correctInput ? undefined : errorMessage)}
          onChange={onChange}
        />
      </React.Fragment>
    );

    const { onSubmit, container, getByText, queryByText } = setup<T>(
      {
        validatedInput: undefined,
      },
      form,
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => expect(getByText(errorMessage)).toBeVisible());
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(0));

    userEvent.type(container.querySelector("#validatedInput") as HTMLElement, correctInput);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(correctInput.length));

    userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => expect(queryByText(errorMessage)).toBeNull());

    const expectedResult: T = {
      validatedInput: correctInput,
    };

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expectedResult, expect.anything()));
  });

  test("checkbox input", async () => {
    interface T {
      checkInput: boolean;
      checkInput2?: boolean;
    }

    const form = (
      <React.Fragment>
        <InputField<T> name="checkInput" type="checkbox" />
        <InputField<T> name="checkInput2" type="checkbox" />
      </React.Fragment>
    );

    const { onSubmit, container } = setup<T>(
      {
        checkInput: false,
        checkInput2: false,
      },
      form,
    );

    fireEvent.click(container.querySelector("#checkInput") as HTMLElement);
    fireEvent.click(container.querySelector("#checkInput2") as HTMLElement);
    fireEvent.click(container.querySelector("#checkInput2") as HTMLElement);
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    const expectedResult: T = {
      checkInput: true,
      checkInput2: false,
    };

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expectedResult, expect.anything()));
  });

  test("number format", async () => {
    interface T {
      withInitialValue: number;
      withoutInitialValue?: number;
    }

    const numberFormatCurrency: NumberFormatProps = {
      thousandSeparator: "'",
      decimalScale: 2,
      fixedDecimalScale: true,
      allowNegative: false,
      prefix: "CHF ",
    };

    const form = (
      <React.Fragment>
        <InputField<T> name="withInitialValue" numberFormatConfig={numberFormatCurrency} />
        <InputField<T> name="withoutInitialValue" numberFormatConfig={numberFormatCurrency} />
      </React.Fragment>
    );

    const { onSubmit, getByLabelText, getByRole } = setup<T>(
      {
        withInitialValue: 42000.5,
      },
      form,
    );

    const inputWithInitialValue = getByLabelText("withInitialValue") as HTMLInputElement;
    const inputWithoutInitialValue = getByLabelText("withoutInitialValue") as HTMLInputElement;
    const submitButton = getByRole("button", { name: /submit/i });

    expect(inputWithInitialValue.value).toBe("CHF 42'000.50");
    expect(inputWithoutInitialValue.value).toBe("");

    await userEvent.type(inputWithoutInitialValue, "123456.70", { delay: 1 });

    expect((inputWithoutInitialValue as HTMLInputElement).value).toBe("CHF 123'456.70");

    userEvent.click(submitButton);

    const expectedResult: T = {
      withInitialValue: 42000.5,
      withoutInitialValue: 123456.7,
    };

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expectedResult, expect.anything()));
  });

  test("checkbox list", async () => {
    interface T {
      claims: { [key: string]: boolean };
    }

    const form = (
      <React.Fragment>
        {["claim1", "claim2"].map((x) => (
          <InputField
            key={`${nameOf<T>("claims")}["${x}"]`}
            name={`${nameOf<T>("claims")}["${x}"]`}
            type="checkbox"
            label={`Has claim ${x}`}
          />
        ))}
      </React.Fragment>
    );

    const { onSubmit, getByLabelText, getByRole } = setup<T>(
      {
        claims: {
          claim1: true,
          claim2: false,
        },
      },
      form,
    );

    const inputClaim1 = getByLabelText("Has claim claim1") as HTMLInputElement;
    const inputClaim2 = getByLabelText("Has claim claim2") as HTMLInputElement;
    const submitButton = getByRole("button", { name: /submit/i });

    expect(inputClaim1.checked).toBe(true);
    expect(inputClaim2.checked).toBe(false);

    fireEvent.click(inputClaim2);
    expect(inputClaim2.checked).toBe(true);
    userEvent.click(submitButton);

    const expectedResult: T = {
      claims: {
        claim1: true,
        claim2: true,
      },
    };

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expectedResult, expect.anything()));
  });
});
