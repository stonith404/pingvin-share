import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import axios from "axios";
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

const Upload = () => {
  const router = useRouter();
  const modals = useModals();

  const user = useUser();
  const config = useConfig();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);

  const uploadFiles = async (share: CreateShare) => {
    setisUploading(true);
    try {
      setFiles((files) =>
        files.map((file) => {
          file.uploadingProgress = 1;
          return file;
        })
      );
      createdShare = await shareService.create(share);

      const uploadPromises = files.map((file, i) => {
        // Callback to indicate current upload progress
        const progressCallBack = (progress: number) => {
          setFiles((files) => {
            return files.map((file, callbackIndex) => {
              if (i == callbackIndex) {
                file.uploadingProgress = progress;
              }
              return file;
            });
          });
        };

        try {
          return promiseLimit(() =>
            shareService.uploadFile(share.id, file, progressCallBack)
          );
        } catch {
          file.uploadingProgress = -1;
        }
      });

      await Promise.all(uploadPromises);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data?.message ?? "An unkown error occured.");
      } else {
        toast.error("An unkown error occured.");
      }
      setisUploading(false);
    }
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
            toast.error("An error occured while finishing your share.")
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
