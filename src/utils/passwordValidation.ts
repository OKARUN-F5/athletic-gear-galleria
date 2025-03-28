
// Password regex for requirements
export const passwordRegex = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()_+\-=\[\]{};:'\\|,.<>\/?~`]/
};

export const checkPasswordRequirement = (regex: RegExp, password: string) => {
  return regex.test(password);
};
