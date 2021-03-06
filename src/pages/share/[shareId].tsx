import { Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Meta from "../../components/Meta";
import DownloadAllButton from "../../components/share/DownloadAllButton";
import FileList from "../../components/share/FileList";
import showEnterPasswordModal from "../../components/share/showEnterPasswordModal";
import showErrorModal from "../../components/share/showErrorModal";
import authService from "../../services/auth.service";
import shareService from "../../services/share.service";
import { AppwriteFileWithPreview } from "../../types/File.type";

const Share = () => {
  const router = useRouter();
  const modals = useModals();
  const shareId = router.query.shareId as string;
  const [fileList, setFileList] = useState<AppwriteFileWithPreview[]>([]);

  const submitPassword = async (password: string) => {
    await shareService.authenticateWithPassword(shareId, password).then(() => {
      modals.closeAll();
      getFiles();
    });
  };

  const getFiles = async (password?: string) => {
    try {
      await authService.createJWT();
    } catch {
      //
    }

    shareService
      .get(shareId, password)
      .then((files) => {
        setFileList(files);
      })
      .catch((e) => {
        const error = e.response.data.message;
        if (e.response.status == 404) {
          showErrorModal(
            modals,
            "Not found",
            "This share can't be found. Please check your link."
          );
        } else if (error == "password_required") {
          showEnterPasswordModal(modals, submitPassword);
        } else if (error == "visitor_limit_exceeded") {
          showErrorModal(
            modals,
            "Visitor limit exceeded",
            "The visitor limit from this share has been exceeded."
          );
        } else if (error == "forbidden") {
          showErrorModal(
            modals,
            "Forbidden",
            "You're not allowed to see this share. Are you logged in with the correct account?"
          );
        } else {
          showErrorModal(modals, "Error", "An unknown error occurred.");
        }
      });
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <>
      <Meta
        title={`Share ${shareId}`}
        description="Look what I've shared with you."
      />
      <Group position="right">
        <DownloadAllButton
          shareId={shareId}
          files={fileList}
          setFiles={setFileList}
        />
      </Group>
      <FileList
        files={fileList}
        shareId={shareId}
        isLoading={fileList.length == 0}
      />
    </>
  );
};

export default Share;
