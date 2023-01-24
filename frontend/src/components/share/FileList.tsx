import { ActionIcon, Loader, Skeleton, Table } from "@mantine/core";
import { TbCircleCheck, TbDownload } from "react-icons/tb";
import shareService from "../../services/share.service";

import { byteStringToHumanSizeString } from "../../utils/fileSize.util";

const FileList = ({
  files,
  shareId,
  isLoading,
}: {
  files?: any[];
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
                <td>{byteStringToHumanSizeString(file.size)}</td>
                <td>
                  {file.uploadingState ? (
                    file.uploadingState != "finished" ? (
                      <Loader size={22} />
                    ) : (
                      <TbCircleCheck color="green" size={22} />
                    )
                  ) : (
                    <ActionIcon
                      size={25}
                      onClick={async () => {
                        await shareService.downloadFile(shareId, file.id);
                      }}
                    >
                      <TbDownload />
                    </ActionIcon>
                  )}
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
