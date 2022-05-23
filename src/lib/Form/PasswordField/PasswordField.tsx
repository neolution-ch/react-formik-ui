import { useFormikContext } from "formik";
import React from "react";
import { IPasswordFieldTranslations, Translations } from "../../Utils/translations";
import { InputField } from "../InputField/InputField";

interface PasswordFieldProps {
  /** The name of the password field */
  name: string;
  /** The label of the password field */
  label?: string;
  /** The name of the password confirm field. Confirm field will only be shown if this is set. */
  confirmFieldName?: string;
  /** The label of the password confirm field */
  confirmFieldLabel?: string;
  /** Indicates if the password complexity should be checked. Default is true */
  checkPasswordComplexity?: boolean;
  /** Custom translations if needed */
  customTranslations?: IPasswordFieldTranslations;
}

const PasswordField = ({
  name,
  label = name,
  confirmFieldName,
  confirmFieldLabel = confirmFieldName,
  checkPasswordComplexity = true,
  customTranslations,
}: PasswordFieldProps) => {
  const regexp = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).)");
  const { values } = useFormikContext();
  const translations = customTranslations || Translations.getTranslations().passwordFieldTranslations;

  return (
    <React.Fragment>
      <InputField
        type="password"
        name={name}
        label={label}
        autoComplete={confirmFieldName ? "new-password" : "current-password"}
        validation={(value: string) => {
          if (!value) {
            return translations.errorRequired;
          }
          if (checkPasswordComplexity) {
            if (value.length < 8 || value.length > 40) {
              return translations.errorPasswordComplexity;
            }
            if (!regexp.test(value)) {
              return translations.errorPasswordComplexityCharacters;
            }
          }

          return undefined;
        }}
      />
      {confirmFieldName && (
        <InputField
          type="password"
          name={confirmFieldName}
          label={confirmFieldLabel}
          autoComplete="new-password"
          validation={(value: string) => {
            if (!value) {
              return translations.errorRequired;
            }
            if (value !== (values as any)[name]) {
              return translations.errorPasswordsAreNotIdentical;
            }

            return undefined;
          }}
        />
      )}
    </React.Fragment>
  );
};

export { PasswordField, PasswordFieldProps };
