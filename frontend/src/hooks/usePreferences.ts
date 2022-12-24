const defaultPreferences = [
  {
    key: "colorScheme",
    value: "system",
  },
];

const get = (key: string) => {
  if (typeof window !== "undefined") {
    const preferences = JSON.parse(localStorage.getItem("preferences") ?? "{}");
    return (
      preferences[key] ??
      defaultPreferences.find((p) => p.key == key)?.value ??
      null
    );
  }
};

const set = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    const preferences = JSON.parse(localStorage.getItem("preferences") ?? "{}");
    preferences[key] = value;
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }
};
const usePreferences = () => {
  return { get, set };
};

export default usePreferences;
