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
      files.forEach((file) => {
        file.uploadingState = "inProgress";
      });
      setFiles([...files]);
      const share = await shareService.create(id, expiration, security);
      for (let i = 0; i < files.length; i++) {
        await shareService.uploadFile(share.id, files[i]);

        files[i].uploadingState = "finished";
        setFiles([...files]);
        if (!files.some((f) => f.uploadingState == "inProgress")) {
          await shareService.completeShare(share.id);
          setisUploading(false);
          showCompletedUploadModal(
            modals,

            share
          );
          setFiles([]);
        }
      }
    } catch (e) {
      files.forEach((file) => {
        file.uploadingState = undefined;
      });
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data?.message ?? "An unkown error occured.");
      } else {
        toast.error("An unkown error occured.");
      }
      setFiles([...files]);
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
