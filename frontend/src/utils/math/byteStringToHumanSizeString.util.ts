export function byteStringToHumanSizeString(bytes: string) {
  const bytesNumber = parseInt(bytes);
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytesNumber == 0) return "0 Byte";
  const i = parseInt(
    Math.floor(Math.log(bytesNumber) / Math.log(1024)).toString()
  );
  return (
    (bytesNumber / Math.pow(1024, i)).toFixed(1).toString() + " " + sizes[i]
  );
}
