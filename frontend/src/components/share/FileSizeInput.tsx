import { NativeSelect, NumberInput } from "@mantine/core";
import { useState } from "react";

const multipliers = {
  B: 1,
  KB: 1000,
  KiB: 1024,
  MB: 1000 ** 2,
  MiB: 1024 ** 2,
  GB: 1000 ** 3,
  GiB: 1024 ** 3,
  TB: 1000 ** 4,
  TiB: 1024 ** 4,
}

const units = (["B", "KB", "KiB", "MB", "MiB", "GB", "GiB", "TB", "TiB"] as const).map(unit => ({ label: unit, value: unit }));

function getLargestApplicableUnit(value: number) {
  return units.findLast(unit => value % multipliers[unit.value] === 0) || units[0];
}

const FileSizeInput = ({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: number;
  onChange: (number: number) => void;
}) => {
  const [unit, setUnit] = useState(getLargestApplicableUnit(value).value);
  const [inputValue, setInputValue] = useState(value / multipliers[unit]);
  const unitSelect = (
    <NativeSelect
      data={units}
      rightSectionWidth={28}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: 76,
          marginRight: -2,
        },
      }}
      onChange={event => {
        const unit = event.currentTarget.value as typeof units[number]["value"];
        setUnit(unit);
        onChange(multipliers[unit] * inputValue);
      }}
    />
  );

  return (
    <NumberInput
      label={label}
      min={1}
      max={999999}
      precision={0}
      rightSection={unitSelect}
      rightSectionWidth={76}
      onChange={value => {
        const inputVal = value || 0;
        setInputValue(inputVal);
        onChange(multipliers[unit] * inputVal);
      }}
    />
  );
};

export default FileSizeInput;
