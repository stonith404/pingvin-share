import { ActionIcon, Table } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { TbTrash } from "react-icons/tb";;
import { FileUpload } from "../../types/File.type";
import { byteStringToHumanSizeString } from "../../utils/math/byteStringToHumanSizeString.util";
import UploadProgressIndicator from "./UploadProgressIndicator";

const FileList = ({
  files,
  setFiles,
}: {
  files: FileUpload[];
  setFiles: Dispatch<SetStateAction<FileUpload[]>>;
}) => {
  const remove = (index: number) => {
    files.splice(index, 1);
    setFiles([...files]);
  };
  const rows = files.map((file, i) => (
    <tr key={i}>
      <td>{file.name}</td>
      <td>{byteStringToHumanSizeString(file.size.toString())}</td>
      <td>
        {file.uploadingProgress == 0 ? (
          <ActionIcon
            color="red"
            variant="light"
            size={25}
            onClick={() => remove(i)}
          >
            <TbTrash />
          </ActionIcon>
        ) : (
          <UploadProgressIndicator progress={file.uploadingProgress} />
        )}
      </td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default FileList;
