export interface IPasswordFieldTranslations {
  errorRequired: string;
  errorPasswordComplexity: string;
  errorPasswordComplexityCharacters: string;
  errorPasswordsAreNotIdentical: string;
}

export interface ITranslations {
  passwordFieldTranslations: IPasswordFieldTranslations;
}

class Translations {
  static translations: ITranslations = {
    passwordFieldTranslations: {
      errorRequired: "Input is mandatory",
      errorPasswordComplexity: "Password lenght must be between 8 and 40 characters",
      errorPasswordComplexityCharacters: "The password must contain at least 1 uppercase, 1 lowercase character and 1 digit.",
      errorPasswordsAreNotIdentical: "The passwords are not identical",
    },
  };

  static getTranslations(): ITranslations {
    return Translations.translations;
  }

  static setTranslations(translations: ITranslations): void {
    Translations.translations = translations;
  }
}

export { Translations };
