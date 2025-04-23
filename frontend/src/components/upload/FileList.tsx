import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { TbTrash } from "react-icons/tb";
import { GrUndo } from "react-icons/gr";
import { FileListItem, FileUpload } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import UploadProgressIndicator from "./UploadProgressIndicator";
import { FormattedMessage } from "react-intl";
import useTranslate from "../../hooks/useTranslate.hook";
import { formatTimeRemaining } from "../../utils/time.util";

const FileListRow = ({
  file,
  onRemove,
  onRestore,
}: {
  file: FileListItem;
  onRemove?: () => void;
  onRestore?: () => void;
}) => {
  const t = useTranslate();
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
          {uploading &&
            uploadable &&
            file.estimatedTimeRemaining !== undefined && (
              <Tooltip label={t("upload.filelist.time-remaining")}>
                <Text size="xs" color="dimmed" mr={8}>
                  {formatTimeRemaining(file.estimatedTimeRemaining)}
                </Text>
              </Tooltip>
            )}
        </td>
        <td>
          {removable && (
            <ActionIcon
              color="red"
              variant="light"
              size={25}
              onClick={onRemove}
            >
              <TbTrash />
            </ActionIcon>
          )}
          {uploading && (
            <UploadProgressIndicator progress={file.uploadingProgress} />
          )}
          {restorable && (
            <ActionIcon
              color="primary"
              variant="light"
              size={25}
              onClick={onRestore}
            >
              <GrUndo />
            </ActionIcon>
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

  // Calculate upload statistics
  const uploadableFiles = files.filter(
    (file) => "uploadingProgress" in file,
  ) as unknown as FileUpload[];

  const inProgressFiles = uploadableFiles.filter(
    (file) => file.uploadingProgress > 0 && file.uploadingProgress < 100,
  ).length;

  const pendingFiles = uploadableFiles.filter(
    (file) => file.uploadingProgress === 0,
  ).length;

  const remainingFiles = inProgressFiles + pendingFiles;

  // Calculate overall estimated time
  let maxEstimatedTime = 0;
  if (inProgressFiles > 0) {
    for (const file of uploadableFiles) {
      if (
        file.estimatedTimeRemaining &&
        file.estimatedTimeRemaining > maxEstimatedTime
      ) {
        maxEstimatedTime = file.estimatedTimeRemaining;
      }
    }
  }

  return (
    <>
      {uploadableFiles.length > 0 && remainingFiles > 0 && (
        <Box mb={16}>
          <Group position="apart">
            <Text size="sm">
              <FormattedMessage
                id="upload.filelist.remaining-files"
                values={{
                  count: remainingFiles,
                  total: uploadableFiles.length,
                }}
              />
            </Text>
            {maxEstimatedTime > 0 && (
              <Badge color="blue" variant="light">
                <FormattedMessage
                  id="upload.filelist.estimated-time"
                  values={{ time: formatTimeRemaining(maxEstimatedTime) }}
                />
              </Badge>
            )}
          </Group>
        </Box>
      )}
      <Table>
        <thead>
          <tr>
            <th>
              <FormattedMessage id="upload.filelist.name" />
            </th>
            <th>
              <FormattedMessage id="upload.filelist.size" />
            </th>
            <th>
              <FormattedMessage id="upload.filelist.time" />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};

export default FileList;
