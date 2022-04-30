import { Tooltip, Button } from "@mantine/core";
import saveAs from "file-saver";
import JSZip from "jszip";
import { Dispatch, SetStateAction, useState } from "react";
import { AppwriteFileWithPreview } from "../../types/File.type";
import aw from "../../utils/appwrite.util";

const DownloadAllButton = ({
  shareId,
  files,
  setFiles,
}: {
  shareId: string;
  files: AppwriteFileWithPreview[];
  setFiles: Dispatch<SetStateAction<AppwriteFileWithPreview[]>>;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const downloadAll = async () => {
    setIsLoading(true);
    var zip = new JSZip();
    for (let i = 0; i < files.length; i++) {
      files[i].uploadingState = "inProgress";
      setFiles([...files]);
      zip.file(
        files[i].name,
        await (
          await fetch(
            aw.storage.getFileDownload(shareId, files[i].$id).toString()
          )
        ).blob()
      );
      files[i].uploadingState = "finished";
      setFiles([...files]);
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      setIsLoading(false);
      saveAs(content, `${shareId}-pingvin-share.zip`);
    });
  };
  const isFileTooBig = () => {
    let shareSize = 0;
    files.forEach((file) => (shareSize = +file.sizeOriginal));
    return 150000000 > shareSize;
  };

  if (!isFileTooBig())
    return (
      <Tooltip
        wrapLines
        position="bottom"
        width={220}
        withArrow
        label="Only available if your share is smaller than 150 MB."
      >
        <Button variant="outline" onClick={downloadAll} disabled>
          Download all
        </Button>
      </Tooltip>
    );
  return (
    <Button variant="outline" loading={isLoading} onClick={downloadAll}>
      Download all
    </Button>
  );
};

export default DownloadAllButton;
