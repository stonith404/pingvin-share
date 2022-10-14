import { Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import Meta from "../../components/Meta";
import DownloadAllButton from "../../components/share/DownloadAllButton";
import FileList from "../../components/share/FileList";
import showEnterPasswordModal from "../../components/share/showEnterPasswordModal";
import showErrorModal from "../../components/share/showErrorModal";
import shareService from "../../services/share.service";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { shareId: context.params!.shareId },
  };
}

const Share = ({ shareId }: { shareId: string }) => {
  const modals = useModals();
  const [fileList, setFileList] = useState<any[]>([]);

  const getShareToken = async (password?: string) => {
    await shareService
      .getShareToken(shareId, password)
      .then(() => {
        modals.closeAll();
        getFiles();
      })
      .catch((e) => {
        if (e.response.data.error == "share_max_views_exceeded") {
          showErrorModal(
            modals,
            "Visitor limit exceeded",
            "The visitor limit from this share has been exceeded."
          );
        }
      });
  };

  const getFiles = async () => {
    shareService
      .get(shareId)
      .then((share) => {
        setFileList(share.files);
      })
      .catch((e) => {
        const { error } = e.response.data;
        if (e.response.status == 404) {
          showErrorModal(
            modals,
            "Not found",
            "This share can't be found. Please check your link."
          );
        } else if (error == "share_password_required") {
          showEnterPasswordModal(modals, getShareToken);
        } else if (error == "share_token_required") {
          getShareToken();
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
      <Group position="right" mb="lg">
        <DownloadAllButton shareId={shareId} />
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
