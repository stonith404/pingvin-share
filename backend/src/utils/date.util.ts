import * as moment from "moment";

export function parseRelativeDateToAbsolute(relativeDate: string) {
  if (relativeDate == "never") return moment(0).toDate();

  return moment()
    .add(
      relativeDate.split("-")[0],
      relativeDate.split("-")[1] as moment.unitOfTime.DurationConstructor,
    )
    .toDate();
}

type Timespan = {
  value: number;
  unit: "minutes" | "hours" | "days" | "weeks" | "months" | "years";
};

export function stringToTimespan(value: string): Timespan {
  const [time, unit] = value.split(" ");
  return {
    value: parseInt(time),
    unit: unit as Timespan["unit"],
  };
}

export function timespanToString(timespan: Timespan) {
  return `${timespan.value} ${timespan.unit}`;
}
