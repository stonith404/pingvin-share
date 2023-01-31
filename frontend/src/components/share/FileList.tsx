import { ActionIcon, Group, Skeleton, Table } from "@mantine/core";
import mime from "mime-types";
import Link from "next/link";
import { TbDownload, TbEye } from "react-icons/tb";
import shareService from "../../services/share.service";
import { FileMetaData } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";

const FileList = ({
  files,
  shareId,
  isLoading,
}: {
  files?: FileMetaData[];
  shareId: string;
  isLoading: boolean;
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? skeletonRows
          : files!.map((file) => (
              <tr key={file.name}>
                <td>{file.name}</td>
                <td>{byteToHumanSizeString(parseInt(file.size))}</td>
                <td>
                  <Group position="right">
                    {shareService.doesFileSupportPreview(file.name) && (
                      <ActionIcon
                        component={Link}
                        href={`/share/${shareId}/preview/${
                          file.id
                        }?type=${mime.contentType(file.name)}`}
                        target="_blank"
                        size={25}
                      >
                        <TbEye />
                      </ActionIcon>
                    )}
                    <ActionIcon
                      size={25}
                      onClick={async () => {
                        await shareService.downloadFile(shareId, file.id);
                      }}
                    >
                      <TbDownload />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

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

export default FileList;
