export const configVariableToFriendlyName = (variable: string) => {
  const splitted = variable.split(/(?=[A-Z])/).join(" ");
  return splitted.charAt(0).toUpperCase() + splitted.slice(1);
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
