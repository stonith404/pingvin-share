import { Button, Table } from "@mantine/core";
import { TbTrash } from "react-icons/tb";
import { GrUndo } from "react-icons/gr";
import { FileListItem } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import UploadProgressIndicator from "./UploadProgressIndicator";
import { FormattedMessage } from "react-intl";

const FileListRow = ({
  file,
  onRemove,
  onRestore,
}: {
  file: FileListItem;
  onRemove?: () => void;
  onRestore?: () => void;
}) => {
  {
    const uploadable = "uploadingProgress" in file;
    const uploading = uploadable && file.uploadingProgress !== 0;
    const removable = uploadable
      ? file.uploadingProgress === 0
      : onRemove && !file.deleted;
    const restorable = onRestore && !uploadable && !!file.deleted; // maybe undefined, force boolean
    const deleted = !uploadable && !!file.deleted;

    return (
      <tr
        style={{
          color: deleted ? "rgba(120, 120, 120, 0.5)" : "inherit",
          textDecoration: deleted ? "line-through" : "none",
        }}
      >
        <td>{file.name}</td>
        <td>{byteToHumanSizeString(+file.size)}</td>
        <td>
          {removable && (
            <Button
              color="red"
              variant="light"
              size="xs"
              leftIcon={<TbTrash />}
              onClick={onRemove}
            >
              <FormattedMessage id="common.button.delete" />
            </Button>
          )}
          {uploading && (
            <UploadProgressIndicator progress={file.uploadingProgress} />
          )}
          {restorable && (
            <Button
              color="primary"
              variant="light"
              size="xs"
              leftIcon={<GrUndo />}
              onClick={onRestore}
            >
              <FormattedMessage id="common.button.undo" />
            </Button>
          )}
        </td>
      </tr>
    );
  }
};

const FileList = <T extends FileListItem = FileListItem>({
  files,
  setFiles,
}: {
  files: T[];
  setFiles: (files: T[]) => void;
}) => {
  const remove = (index: number) => {
    const file = files[index];

    if ("uploadingProgress" in file) {
      files.splice(index, 1);
    } else {
      files[index] = { ...file, deleted: true };
    }

    setFiles([...files]);
  };

  const restore = (index: number) => {
    const file = files[index];

    if ("uploadingProgress" in file) {
      return;
    } else {
      files[index] = { ...file, deleted: false };
    }

    setFiles([...files]);
  };

  const rows = files.map((file, i) => (
    <FileListRow
      key={i}
      file={file}
      onRemove={() => remove(i)}
      onRestore={() => restore(i)}
    />
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>
            <FormattedMessage id="upload.filelist.name" />
          </th>
          <th>
            <FormattedMessage id="upload.filelist.size" />
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default FileList;
