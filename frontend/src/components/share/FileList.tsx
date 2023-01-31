import {
  ActionIcon,
  Group,
  Skeleton,
  Stack,
  Table,
  TextInput,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import mime from "mime-types";

import Link from "next/link";
import { TbDownload, TbEye, TbLink } from "react-icons/tb";
import useConfig from "../../hooks/config.hook";
import shareService from "../../services/share.service";
import { FileMetaData } from "../../types/File.type";
import { Share } from "../../types/share.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import toast from "../../utils/toast.util";

const FileList = ({
  files,
  share,
  isLoading,
}: {
  files?: FileMetaData[];
  share: Share;
  isLoading: boolean;
}) => {
  const clipboard = useClipboard();
  const config = useConfig();
  const modals = useModals();

  const copyFileLink = (file: FileMetaData) => {
    const link = `${config.get("APP_URL")}/api/shares/${share.id}/files/${
      file.id
    }`;

    if (window.isSecureContext) {
      clipboard.copy(link);
      toast.success("Your file link was copied to the keyboard.");
    } else {
      modals.openModal({
        title: "File link",
        children: (
          <Stack align="stretch">
            <TextInput variant="filled" value={link} />
          </Stack>
        ),
      });
    }
  };

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
                        href={`/share/${share.id}/preview/${
                          file.id
                        }?type=${mime.contentType(file.name)}`}
                        target="_blank"
                        size={25}
                      >
                        <TbEye />
                      </ActionIcon>
                    )}
                    {!share.hasPassword && (
                      <ActionIcon size={25} onClick={() => copyFileLink(file)}>
                        <TbLink />
                      </ActionIcon>
                    )}
                    <ActionIcon
                      size={25}
                      onClick={async () => {
                        await shareService.downloadFile(share.id, file.id);
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
