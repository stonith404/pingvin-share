import { LoadingOverlay } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import showErrorModal from "../../../components/share/showErrorModal";
import shareService from "../../../services/share.service";
import { Share as ShareType } from "../../../types/share.type";
import useTranslate from "../../../hooks/useTranslate.hook";
import EditableUpload from "../../../components/upload/EditableUpload";
import Meta from "../../../components/Meta";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { shareId: context.params!.shareId },
  };
}

const Share = ({ shareId }: { shareId: string }) => {
  const t = useTranslate();
  const modals = useModals();
  const [isLoading, setIsLoading] = useState(true);
  const [share, setShare] = useState<ShareType>();

  useEffect(() => {
    shareService
      .getFromOwner(shareId)
      .then((share) => {
        setShare(share);
      })
      .catch((e) => {
        const { error } = e.response.data;
        if (e.response.status == 404) {
          if (error == "share_removed") {
            showErrorModal(
              modals,
              t("share.error.removed.title"),
              e.response.data.message,
            );
          } else {
            showErrorModal(
              modals,
              t("share.error.not-found.title"),
              t("share.error.not-found.description"),
            );
          }
        } else {
          showErrorModal(modals, t("common.error"), t("common.error.unknown"));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <LoadingOverlay visible />;

  return (
    <>
      <Meta title={t("share.edit.title", { shareId })} />
      <EditableUpload shareId={shareId} files={share?.files || []} />
    </>
  );
};

export default Share;
