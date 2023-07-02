import { LoadingOverlay } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import {useEffect, useRef, useState} from "react";
import Upload from ".";
import showErrorModal from "../../components/share/showErrorModal";
import shareService from "../../services/share.service";
import {defaultReverseShareOptions, MyReverseShare} from "../../types/share.type";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { reverseShareToken: context.params!.reverseShareToken },
  };
}

const Share = ({ reverseShareToken }: { reverseShareToken: string }) => {
  const modals = useModals();
  const [isLoading, setIsLoading] = useState(true);
  const reverseShareOptions = useRef(defaultReverseShareOptions);
  const [maxShareSize, setMaxShareSize] = useState(0);

  useEffect(() => {
    shareService
      .setReverseShare(reverseShareToken)
      .then((reverseShareTokenData: MyReverseShare) => {
        reverseShareOptions.current = reverseShareTokenData.sharesOptions;
        setMaxShareSize(parseInt(reverseShareTokenData.maxShareSize));
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

  if (isLoading) return <LoadingOverlay visible />;

  return <Upload isReverseShare shareOptions={reverseShareOptions.current} maxShareSize={maxShareSize} />;
};

export default Share;
