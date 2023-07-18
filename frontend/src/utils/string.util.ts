export const camelToKebab = (camelCaseString: string) => {
  return camelCaseString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
