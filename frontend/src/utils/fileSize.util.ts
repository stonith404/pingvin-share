export function byteToHumanSizeString(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return (bytes / Math.pow(1024, i)).toFixed(1).toString() + " " + sizes[i];
}

export function byteToUnitAndSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return { unit: "B", size: 0 };
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());

  return {
    size: parseFloat((bytes / Math.pow(1024, i)).toFixed(1)),
    unit: units[i],
  };
}

export function unitAndSizeToByte(unit: string, size: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = units.indexOf(unit);
  return Math.pow(1024, i) * size;
}
