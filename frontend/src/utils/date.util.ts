import moment from "moment";

export const getExpirationPreview = (
  name: string,
  form: {
    values: {
      never_expires?: boolean;
      expiration_num: number;
      expiration_unit: string;
    };
  }
) => {
  const value = form.values.never_expires
    ? "never"
    : form.values.expiration_num + form.values.expiration_unit;
  if (value === "never") return `This ${name} will never expire.`;

  const expirationDate = moment()
    .add(
      value.split("-")[0],
      value.split("-")[1] as moment.unitOfTime.DurationConstructor
    )
    .toDate();

  return `This ${name} will expire on ${moment(expirationDate).format("LLL")}`;
};
