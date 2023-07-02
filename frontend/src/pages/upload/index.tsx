import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { cleanNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import pLimit from "p-limit";
import { useEffect, useState } from "react";
import Meta from "../../components/Meta";
import Dropzone from "../../components/upload/Dropzone";
import FileList from "../../components/upload/FileList";
import showCompletedUploadModal from "../../components/upload/modals/showCompletedUploadModal";
import showCreateUploadModal from "../../components/upload/modals/showCreateUploadModal";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";
import shareService from "../../services/share.service";
import { FileUpload } from "../../types/File.type";
import {
  CreateShare,
  defaultReverseShareOptions,
  MyReverseShare,
  ReverseShareOptions,
  Share,
} from "../../types/share.type";
import toast from "../../utils/toast.util";

const promiseLimit = pLimit(3);
const chunkSize = 10 * 1024 * 1024; // 10MB
let errorToastShown = false;
let createdShare: Share;

const Upload = ({
  maxShareSize,
  isReverseShare = false,
  shareOptions,
}: {
  maxShareSize?: number;
  isReverseShare: boolean;
  shareOptions: ReverseShareOptions;
}) => {
  const modals = useModals();

  const { user } = useUser();
  const config = useConfig();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);

  maxShareSize ??= parseInt(config.get("share.maxSize"));
  shareOptions ??= defaultReverseShareOptions;

  const uploadFiles = async (share: CreateShare) => {
    setisUploading(true);
    createdShare = await shareService.create(share);

    const fileUploadPromises = files.map(async (file, fileIndex) =>
      // Limit the number of concurrent uploads to 3
      promiseLimit(async () => {
        let fileId: string;

        const setFileProgress = (progress: number) => {
          setFiles((files) =>
            files.map((file, callbackIndex) => {
              if (fileIndex == callbackIndex) {
                file.uploadingProgress = progress;
              }
              return file;
            })
          );
        };

        setFileProgress(1);

        let chunks = Math.ceil(file.size / chunkSize);

        // If the file is 0 bytes, we still need to upload 1 chunk
        if (chunks == 0) chunks++;

        for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
          const from = chunkIndex * chunkSize;
          const to = from + chunkSize;
          const blob = file.slice(from, to);
          try {
            await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = async (event) =>
                await shareService
                  .uploadFile(
                    createdShare.id,
                    event,
                    {
                      id: fileId,
                      name: file.name,
                    },
                    chunkIndex,
                    chunks
                  )
                  .then((response) => {
                    fileId = response.id;
                    resolve(response);
                  })
                  .catch(reject);

              reader.readAsDataURL(blob);
            });

            setFileProgress(((chunkIndex + 1) / chunks) * 100);
          } catch (e) {
            if (
              e instanceof AxiosError &&
              e.response?.data.error == "unexpected_chunk_index"
            ) {
              // Retry with the expected chunk index
              chunkIndex = e.response!.data!.expectedChunkIndex - 1;
              continue;
            } else {
              setFileProgress(-1);
              // Retry after 5 seconds
              await new Promise((resolve) => setTimeout(resolve, 5000));
              chunkIndex = -1;

              continue;
            }
          }
        }
      })
    );

    Promise.all(fileUploadPromises);
  };

  useEffect(() => {
    // Check if there are any files that failed to upload
    const fileErrorCount = files.filter(
      (file) => file.uploadingProgress == -1
    ).length;

    if (fileErrorCount > 0) {
      if (!errorToastShown) {
        toast.error(
          `${fileErrorCount} file(s) failed to upload. Trying again.`,
          {
            withCloseButton: false,
            autoClose: false,
          }
        );
      }
      errorToastShown = true;
    } else {
      cleanNotifications();
      errorToastShown = false;
    }

    // Complete share
    if (
      files.length > 0 &&
      files.every((file) => file.uploadingProgress >= 100) &&
      fileErrorCount == 0
    ) {
      shareService
        .completeShare(createdShare.id)
        .then((share) => {
          setisUploading(false);
          showCompletedUploadModal(modals, share, config.get("general.appUrl"));
          setFiles([]);
        })
        .catch(() =>
          toast.error("An error occurred while finishing your share.")
        );
    }
  }, [files]);

  return (
    <>
      <Meta title="Upload" />
      <Group position="right" mb={20}>
        <Button
          loading={isUploading}
          disabled={files.length <= 0}
          onClick={() => {
            showCreateUploadModal(
              modals,
              {
                isUserSignedIn: user ? true : false,
                isReverseShare,
                shareOptions: shareOptions,
                appUrl: config.get("general.appUrl"),
                allowUnauthenticatedShares: config.get(
                  "share.allowUnauthenticatedShares"
                ),
                enableEmailRecepients: config.get(
                  "email.enableShareEmailRecipients"
                ),
              },
              uploadFiles
            );
          }}
        >
          Share
        </Button>
      </Group>
      <Dropzone
        maxShareSize={maxShareSize}
        files={files}
        setFiles={setFiles}
        isUploading={isUploading}
      />
      {files.length > 0 && <FileList files={files} setFiles={setFiles} />}
    </>
  );
};
export default Upload;
