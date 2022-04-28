import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Meta from "../../components/Meta";
import FileList from "../../components/share/FileList";
import showEnterPasswordModal from "../../components/share/showEnterPasswordModal";
import showShareNotFoundModal from "../../components/share/showShareNotFoundModal";
import showVisitorLimitExceededModal from "../../components/share/showVisitorLimitExceededModal";
import shareService from "../../services/share.service";
import { AppwriteFileWithPreview } from "../../types/File.type";

const Share = () => {
  const router = useRouter();
  const modals = useModals();
  const shareId = router.query.shareId as string;
  const [shareList, setShareList] = useState<AppwriteFileWithPreview[]>([]);

  const submitPassword = async (password: string) => {
    await shareService.authenticateWithPassword(shareId, password).then(() => {
      modals.closeAll();
      getFiles();
    });
  };

  const getFiles = (password?: string) =>
    shareService
      .get(shareId, password)
      .then((files) => setShareList(files))
      .catch((e) => {
        const error = e.response.data.message;
        if (e.response.status == 404) {
          showShareNotFoundModal(modals);
        } else if (error == "password_required") {
          showEnterPasswordModal(modals, submitPassword);
        } else if (error == "visitor_limit_exceeded") {
          showVisitorLimitExceededModal(modals);
        }
      });

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <>
      <Meta title={`Share ${shareId}`} />
      <FileList
        files={shareList}
        shareId={shareId}
        isLoading={shareList.length == 0}
      />
    </>
  );
};

export default Share;
