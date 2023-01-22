import { LoadingOverlay } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import showErrorModal from "../../components/share/showErrorModal";
import shareService from "../../services/share.service";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { reverseShareToken: context.params!.reverseShareToken },
  };
}

const Share = ({ reverseShareToken }: { reverseShareToken: string }) => {
  const modals = useModals();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    shareService
      .setReverseShareToken(reverseShareToken)
      .then(() => {
        setIsLoading(false);
        router.push("/upload");
        setIsLoading(false);
      })
      .catch(() => {
        showErrorModal(
          modals,
          "Invalid Link",
          "This link is invalid. Please check your link."
        );
        setIsLoading(false);
      });
  }, []);

  return <LoadingOverlay visible={isLoading} />;
};

export default Share;
