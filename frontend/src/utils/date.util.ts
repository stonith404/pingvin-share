import moment from "moment";
import { Timespan } from "../types/timespan.type";

export const getExpirationPreview = (
  messages: {
    neverExpires: string;
    expiresOn: string;
  },
  form: {
    values: {
      never_expires?: boolean;
      expiration_num: number;
      expiration_unit: string;
    };
  },
) => {
  const value = form.values.never_expires
    ? "never"
    : form.values.expiration_num + form.values.expiration_unit;
  if (value === "never") return messages.neverExpires;

  const expirationDate = moment()
    .add(
      value.split("-")[0],
      value.split("-")[1] as moment.unitOfTime.DurationConstructor,
    )
    .toDate();

  return messages.expiresOn.replace(
    "{expiration}",
    moment(expirationDate).format("LLL"),
  );
};

export const timespanToString = (timespan: Timespan) => {
  return `${timespan.value} ${timespan.unit}`;
};

export const stringToTimespan = (value: string): Timespan => {
  return {
    value: parseInt(value.split(" ")[0]),
    unit: value.split(" ")[1],
  } as Timespan;
};
