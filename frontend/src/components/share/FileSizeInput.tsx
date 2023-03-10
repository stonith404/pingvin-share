import { Col, Grid, NumberInput, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  byteToUnitAndSize,
  unitAndSizeToByte,
} from "../../utils/fileSize.util";

const FileSizeInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (number: number) => void;
}) => {
  const [unit, setUnit] = useState("MB");
  const [size, setSize] = useState(100);

  useEffect(() => {
    const { unit, size } = byteToUnitAndSize(value);
    setUnit(unit);
    setSize(size);
  }, [value]);

  return (
    <Grid align="flex-end">
      <Col xs={6}>
        <NumberInput
          min={1}
          max={99999}
          precision={0}
          variant="filled"
          label={label}
          value={size}
          onChange={(value) => {
            if (value) {
              setSize(value);
              onChange(unitAndSizeToByte(unit, value));
            }
          }}
        />
      </Col>
      <Col xs={6}>
        <Select
          data={[
            { label: "B", value: "B" },
            { label: "KB", value: "KB" },
            { label: "MB", value: "MB" },
            { label: "GB", value: "GB" },
            { label: "TB", value: "TB" },
          ]}
          value={unit}
          onChange={(value) => {
            setUnit(value!);
            onChange(unitAndSizeToByte(value!, size));
          }}
        />
      </Col>
    </Grid>
  );
};

export default FileSizeInput;
