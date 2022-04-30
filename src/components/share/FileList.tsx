import { ActionIcon, Loader, Skeleton, Table } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { CircleCheck, Download } from "tabler-icons-react";
import { AppwriteFileWithPreview } from "../../types/File.type";
import aw from "../../utils/appwrite.util";
import { bytesToSize } from "../../utils/math/byteToSize.util";

const FileList = ({
  files,
  shareId,
  isLoading,
}: {
  files: AppwriteFileWithPreview[];
  shareId: string;
  isLoading: boolean;
}) => {
  const router = useRouter();

  const skeletonRows = [...Array(5)].map((c, i) => (
    <tr key={i}>
      <td>
        <Skeleton height={30} width={30} />
      </td>
      <td>
        <Skeleton height={14} />
      </td>
      <td>
        <Skeleton height={14} />
      </td>
      <td>
        <Skeleton height={25} width={25} />
      </td>
    </tr>
  ));

  const rows = files.map((file) => (
    <tr key={file.name}>
      <td>
        <Image
          width={30}
          height={30}
          alt={file.name}
          objectFit="cover"
          src={`data:image/png;base64,${new Buffer(file.preview).toString(
            "base64"
          )}`}
        ></Image>
      </td>
      <td>{file.name}</td>
      <td>{bytesToSize(file.sizeOriginal)}</td>
      <td>
        {file.uploadingState ? (
          file.uploadingState != "finished" ? (
            <Loader size={22} />
          ) : (
            <CircleCheck color="green" size={22} />
          )
        ) : (
          <ActionIcon
            size={25}
            onClick={() =>
              router.push(aw.storage.getFileDownload(shareId, file.$id))
            }
          >
            <Download />
          </ActionIcon>
        )}
      </td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Size</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{isLoading ? skeletonRows : rows}</tbody>
    </Table>
  );
};

export default FileList;
