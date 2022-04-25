import { Button, Group, Menu } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Link, Mail } from "tabler-icons-react";
import Dropzone from "../components/upload/Dropzone";
import FileList from "../components/upload/FileList";
import showCompletedUploadModal from "../components/upload/showCompletedUploadModal";
import showCreateUploadModal from "../components/upload/showCreateUploadModal";
import { FileUpload } from "../types/File.type";
import aw from "../utils/appwrite.util";
import { IsSignedInContext } from "../utils/auth.util";
import toast from "../utils/toast.util";

const Upload = () => {
  const router = useRouter();
  const modals = useModals();
  const isSignedIn = useContext(IsSignedInContext);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setisUploading] = useState(false);

  const uploadFiles = async (
    id: string,
    expiration: number,
    security: { password?: string; maxVisitors?: number }
  ) => {
    setisUploading(true);

    const bucketId = JSON.parse(
      (
        await aw.functions.createExecution(
          "createShare",
          JSON.stringify({ id, security, expiration }),
          false
        )
      ).stdout
    ).id;
    for (let i = 0; i < files.length; i++) {
      files[i].uploadingState = "inProgress";
      setFiles([...files]);
      aw.storage.createFile(bucketId, "unique()", files[i]).then(
        async () => {
          files[i].uploadingState = "finished";
          setFiles([...files]);
          if (!files.some((f) => f.uploadingState == "inProgress")) {
            await aw.functions.createExecution(
              "finishShare",
              JSON.stringify({ id }),
              false
            ),
              setisUploading(false);
            showCompletedUploadModal(
              modals,
              `${window.location.origin}/share/${bucketId}`,
              new Date(Date.now() + expiration * 60 * 1000).toLocaleString()
            );
          }
        },
        (error) => {
          files[i].uploadingState = undefined;
          toast.error(error.message);
          setisUploading(false);
        }
      );
    }
  };

  if (!isSignedIn) {
    router.replace("/");
  } else {
    return (
      <>
        <Group position="right" mb={20}>
          <div>
            <Menu
              control={
                <Button loading={isUploading} disabled={files.length <= 0}>
                  Share
                </Button>
              }
              transition="pop-top-right"
              placement="end"
              size="lg"
            >
              <Menu.Item
                icon={<Link size={16} />}
                onClick={() => showCreateUploadModal(modals, uploadFiles)}
              >
                Share with link
              </Menu.Item>
              <Menu.Item disabled icon={<Mail size={16} />}>
                Share with email
              </Menu.Item>
            </Menu>
          </div>
        </Group>
        <Dropzone setFiles={setFiles} isUploading={isUploading} />
        {files.length > 0 && <FileList files={files} setFiles={setFiles} />}
      </>
    );
  }
};
export default Upload;
