import { useState } from "react";
import { Timespan } from "../../types/timespan.type";
import { NativeSelect, NumberInput } from "@mantine/core";
import useTranslate from "../../hooks/useTranslate.hook";

const TimespanInput = ({
  label,
  value,
  onChange,
  ...restProps
}: {
  label?: string;
  value: Timespan;
  onChange: (timespan: Timespan) => void;
  [key: string]: any;
}) => {
  const [unit, setUnit] = useState(value.unit);
  const [inputValue, setInputValue] = useState(value.value);
  const t = useTranslate();

  const version = inputValue == 1 ? "singular" : "plural";
  const unitSelect = (
    <NativeSelect
      data={[
        {
          value: "minutes",
          label: t(`upload.modal.expires.minute-${version}`),
        },
        {
          value: "hours",
          label: t(`upload.modal.expires.hour-${version}`),
        },
        {
          value: "days",
          label: t(`upload.modal.expires.day-${version}`),
        },
        {
          value: "weeks",
          label: t(`upload.modal.expires.week-${version}`),
        },
        {
          value: "months",
          label: t(`upload.modal.expires.month-${version}`),
        },
        {
          value: "years",
          label: t(`upload.modal.expires.year-${version}`),
        },
      ]}
      value={unit}
      rightSectionWidth={28}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: 120,
          marginRight: -2,
        },
      }}
      onChange={(event) => {
        const unit = event.currentTarget.value as Timespan["unit"];
        setUnit(unit);
        onChange({ value: inputValue, unit });
      }}
    />
  );

  return (
    <NumberInput
      label={label}
      value={inputValue}
      min={0}
      max={999999}
      precision={0}
      rightSection={unitSelect}
      rightSectionWidth={120}
      onChange={(value) => {
        const inputVal = value || 0;
        setInputValue(inputVal);
        onChange({ value: inputVal, unit });
      }}
      {...restProps}
    />
  );
};

export default TimespanInput;
