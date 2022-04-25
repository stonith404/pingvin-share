import fs from "fs";
import tar from "tar";

const zipDirectory = (functionName: string) => {
  tar.create(
    {
      gzip: true,
      sync: true,
      cwd: `./../functions/${functionName}`,
      file: "code.tar.gz",
    },
    ["./"]
  );
  return fs.realpathSync("code.tar.gz");
};

export default zipDirectory;
