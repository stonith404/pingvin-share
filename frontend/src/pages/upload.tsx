import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { cleanNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import pLimit from "p-limit";
import { useEffect, useState } from "react";
import Meta from "../components/Meta";
import Dropzone from "../components/upload/Dropzone";
import FileList from "../components/upload/FileList";
import showCompletedUploadModal from "../components/upload/modals/showCompletedUploadModal";
import showCreateUploadModal from "../components/upload/modals/showCreateUploadModal";
import useConfig from "../hooks/config.hook";
import useUser from "../hooks/user.hook";
import shareService from "../services/share.service";
import { FileUpload } from "../types/File.type";
import { CreateShare, Share } from "../types/share.type";
import toast from "../utils/toast.util";

const promiseLimit = pLimit(1);
const chunkSize = 10 * 1024 * 1024; // 10MB
let errorToastShown = false;
let createdShare: Share;


const Upload = () => {
  const router = useRouter();
  const modals = useModals();

  const { user } = useUser();
  const config = useConfig();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);



  const uploadFiles = async (share: CreateShare) => {
    setisUploading(true);
    createdShare = await shareService.create(share);

    const fileUploadPromises = files.map(async (file, fileIndex) =>
      // Limit the number of concurrent uploads to 3
      promiseLimit(async () => {
        let fileId: string;

        const chunks = Math.ceil(file.size / chunkSize);

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
                    Math.ceil(file.size / chunkSize)
                  )
                  .then((response) => {
                    fileId = response.id;
                    resolve(response);
                  })
                  .catch(reject);

              reader.readAsDataURL(blob);
            });

            // Set the progress of the file
            setFiles((files) =>
              files.map((file, callbackIndex) => {
                if (fileIndex == callbackIndex) {
                  file.uploadingProgress = Math.round(
                    ((chunkIndex + 1) / chunks) * 100
                  );
                }
                return file;
              })
            );
          } catch (e) {
            if (
              e instanceof AxiosError &&
              e.response?.data.error == "unexpected_chunk_index"
            ) {
              // Retry with the expected chunk index
              chunkIndex = e.response!.data!.expectedChunkIndex - 1;
              continue;
            } else {
              // Set the progress of the file
              setFiles((files) =>
                files.map((file, callbackIndex) => {
                  if (fileIndex == callbackIndex) {
                    file.uploadingProgress = -1;
                  }
                  return file;
                })
              );
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
        toast.error(`${fileErrorCount} file(s) failed to upload. Trying again.`, {
          disallowClose: true,
          autoClose: false,
        });
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
        .then(() => {
          setisUploading(false);
          showCompletedUploadModal(modals, createdShare);
          setFiles([]);
        })
        .catch(() =>
          toast.error("An error occurred while finishing your share.")
        );
    }

  }, [files]);

  if (!user && !config.get("ALLOW_UNAUTHENTICATED_SHARES")) {
    router.replace("/");
  } else {
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
                  allowUnauthenticatedShares: config.get(
                    "ALLOW_UNAUTHENTICATED_SHARES"
                  ),
                  enableEmailRecepients: config.get("ENABLE_EMAIL_RECIPIENTS"),
                },
                uploadFiles
              );
            }}
          >
            Share
          </Button>
        </Group>
        <Dropzone files={files} setFiles={setFiles} isUploading={isUploading} />
        {files.length > 0 && <FileList files={files} setFiles={setFiles} />}
      </>
    );
  }
};
export default Upload;
