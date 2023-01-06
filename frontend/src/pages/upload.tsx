import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import { useState } from "react";
import Meta from "../components/Meta";
import Dropzone from "../components/upload/Dropzone";
import FileList from "../components/upload/FileList";
import showCreateUploadModal from "../components/upload/modals/showCreateUploadModal";
import useConfig from "../hooks/config.hook";
import useUser from "../hooks/user.hook";
import shareService from "../services/share.service";
import { FileUpload } from "../types/File.type";
import { CreateShare, Share } from "../types/share.type";

let createdShare: Share;
const chunkSize = 10 * 1024 * 1024; // 10MB

const Upload = () => {
  const router = useRouter();
  const modals = useModals();

  const { user } = useUser();
  const config = useConfig();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);

  const uploadFiles = async (share: CreateShare) => {
    const createdShare = await shareService.create(share);

    let fileIndex = 0;
    for (const file of files) {
      const chunks = Math.ceil(file.size / chunkSize);

      for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
        const from = chunkIndex * chunkSize;
        const to = from + chunkSize;
        const blob = file.slice(from, to);
        try {
          await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) =>
              await shareService
                .uploadFile(
                  createdShare.id,
                  e,
                  file.name,
                  chunkIndex,
                  Math.ceil(file.size / chunkSize)
                )
                .then((response) => {
                  const chunks = Math.ceil(file.size / chunkSize) - 1;
                  const isLastChunk = chunkIndex === chunks;

                  chunkIndex++;

                  resolve(response);
                })
                .catch(reject);

            reader.readAsDataURL(blob);
          });

          setFiles((files) => {
            console.log(
              files.map((file, callbackIndex) => {
                console.log({ fileIndex, callbackIndex });
                if (fileIndex == callbackIndex) {
                  file.uploadingProgress = Math.round(
                    (chunkIndex / chunks) * 100
                  );
                }
                return file;
              })
            );
            return files.map((file, callbackIndex) => {
              if (fileIndex == callbackIndex) {
                file.uploadingProgress = Math.round(
                  (chunkIndex / chunks) * 100
                );
              }
              return file;
            });
          });
        } catch (e) {
          console.log("error retry");
          chunkIndex = -1;
          continue;
        }
      }

      fileIndex++;
    }
  };
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
