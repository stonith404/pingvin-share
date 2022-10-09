import { ActionIcon, Loader, Table } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { CircleCheck, Trash } from "tabler-icons-react";
import { FileUpload } from "../../types/File.type";
import { byteStringToHumanSizeString } from "../../utils/math/byteStringToHumanSizeString.util";

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
      <td>{file.type}</td>
      <td>{byteStringToHumanSizeString(file.size.toString())}</td>
      <td>
        {file.uploadingState ? (
          file.uploadingState != "finished" ? (
            <Loader size={22} />
          ) : (
            <CircleCheck color="green" size={22} />
          )
        ) : (
          <ActionIcon
            color="red"
            variant="light"
            size={25}
            onClick={() => remove(i)}
          >
            <Trash />
          </ActionIcon>
        )}
      </td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default FileList;
