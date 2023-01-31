import { Box, Group, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import Meta from "../../../components/Meta";
import DownloadAllButton from "../../../components/share/DownloadAllButton";
import FileList from "../../../components/share/FileList";
import showEnterPasswordModal from "../../../components/share/showEnterPasswordModal";
import showErrorModal from "../../../components/share/showErrorModal";
import shareService from "../../../services/share.service";
import { Share as ShareType } from "../../../types/share.type";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { shareId: context.params!.shareId },
  };
}

const Share = ({ shareId }: { shareId: string }) => {
  const modals = useModals();
  const [share, setShare] = useState<ShareType>();

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
        setShare(share);
      })
      .catch((e) => {
        const { error } = e.response.data;
        if (e.response.status == 404) {
          if (error == "share_removed") {
            showErrorModal(modals, "Share removed", e.response.data.message);
          } else {
            showErrorModal(
              modals,
              "Not found",
              "This share can't be found. Please check your link."
            );
          }
        } else if (error == "share_password_required") {
          showEnterPasswordModal(modals, getShareToken);
        } else if (error == "share_token_required") {
          getShareToken();
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

      <Group position="apart" mb="lg">
        <Box style={{ maxWidth: "70%" }}>
          <Title order={3}>{share?.id}</Title>
          <Text size="sm">{share?.description}</Text>
        </Box>
        {share?.files.length > 1 && <DownloadAllButton shareId={shareId} />}
      </Group>

      <FileList files={share?.files} shareId={shareId} isLoading={!share} />
    </>
  );
};

export default Share;
