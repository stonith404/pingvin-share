import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
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

let createdShare: Share;
const promiseLimit = pLimit(3);
const chunkSize = 10 * 1024 * 1024; // 10MB

const Upload = () => {
  const router = useRouter();
  const modals = useModals();

  const { user } = useUser();
  const config = useConfig();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);

  const uploadFiles = async (share: CreateShare) => {
    createdShare = await shareService.create(share);

    const fileUploadPromises = files.map(async (file, fileIndex) =>
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
          } catch {
            console.log("error retry");
            // chunkIndex = -1;
            // continue;
          }
        }
      })
    );

    Promise.all(fileUploadPromises);
  };

  useEffect(() => {
    if (
      files.length > 0 &&
      files.every(
        (file) => file.uploadingProgress >= 100 || file.uploadingProgress == -1
      )
    ) {
      const fileErrorCount = files.filter(
        (file) => file.uploadingProgress == -1
      ).length;
      setisUploading(false);
      if (fileErrorCount > 0) {
        toast.error(`${fileErrorCount} file(s) failed to upload. Try again.`);
      } else {
        shareService
          .completeShare(createdShare.id)
          .then(() => {
            showCompletedUploadModal(modals, createdShare);
            setFiles([]);
          })
          .catch(() =>
            toast.error("An error occurred while finishing your share.")
          );
      }
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
        <Dropzone setFiles={setFiles} isUploading={isUploading} />
        {files.length > 0 && <FileList files={files} setFiles={setFiles} />}
      </>
    );
  }
};
export default Upload;
