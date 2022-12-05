import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import axios from "axios";
import { useRouter } from "next/router";
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
import { ShareSecurity } from "../types/share.type";
import toast from "../utils/toast.util";

let share: any;

const Upload = () => {
  const router = useRouter();
  const modals = useModals();

  const user = useUser();
  const config = useConfig();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);

  const uploadFiles = async (
    id: string,
    expiration: string,
    recipients: string[],
    security: ShareSecurity
  ) => {
    setisUploading(true);
    try {
      setFiles((files) =>
        files.map((file) => {
          file.uploadingProgress = 1;
          return file;
        })
      );
      share = await shareService.create(id, expiration, recipients, security);
      for (let i = 0; i < files.length; i++) {
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
          await shareService.uploadFile(share.id, files[i], progressCallBack);
        } catch {
          files[i].uploadingProgress = -1;
        }
      }
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
          .completeShare(share.id)
          .then(() => {
            showCompletedUploadModal(modals, share);
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
            onClick={() =>
              showCreateUploadModal(
                modals,
                {
                  isUserSignedIn: user ? true : false,
                  ALLOW_UNAUTHENTICATED_SHARES: config.get(
                    "ALLOW_UNAUTHENTICATED_SHARES"
                  ),
                  ENABLE_EMAIL_RECIPIENTS: config.get(
                    "ENABLE_EMAIL_RECIPIENTS"
                  ),
                },
                uploadFiles
              )
            }
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
