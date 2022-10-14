import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Meta from "../components/Meta";
import Dropzone from "../components/upload/Dropzone";
import FileList from "../components/upload/FileList";
import showCompletedUploadModal from "../components/upload/showCompletedUploadModal";
import showCreateUploadModal from "../components/upload/showCreateUploadModal";
import useUser from "../hooks/user.hook";
import shareService from "../services/share.service";
import { FileUpload } from "../types/File.type";
import { ShareSecurity } from "../types/share.type";
import toast from "../utils/toast.util";

const Upload = () => {
  const router = useRouter();
  const modals = useModals();

  const user = useUser();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);

  const uploadFiles = async (
    id: string,
    expiration: string,
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
      const share = await shareService.create(id, expiration, security);
      for (let i = 0; i < files.length; i++) {
        const progressCallBack = (bytesProgress: number) => {
          setFiles((files) => {
            return files.map((file, callbackIndex) => {
              if (i == callbackIndex) {
                file.uploadingProgress = Math.round(
                  (100 * bytesProgress) / files[i].size
                );
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

        if (
          files.every(
            (file) =>
              file.uploadingProgress >= 100 || file.uploadingProgress == -1
          )
        ) {
          const fileErrorCount = files.filter(
            (file) => file.uploadingProgress == -1
          ).length;
          setisUploading(false);
          if (fileErrorCount > 0) {
            toast.error(
              `${fileErrorCount} file(s) failed to upload. Try again.`
            );
          } else {
            await shareService.completeShare(share.id);
            showCompletedUploadModal(modals, share);
            setFiles([]);
          }
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
  if (!user) {
    router.replace("/");
  } else {
    return (
      <>
        <Meta title="Upload" />
        <Group position="right" mb={20}>
          <Button
            loading={isUploading}
            disabled={files.length <= 0}
            onClick={() => showCreateUploadModal(modals, uploadFiles)}
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
