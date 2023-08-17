import { Divider, Flex, Progress, Stack, Text } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { translateOutsideContext } from "../../hooks/useTranslate.hook";
import { FileMetaData } from "../../types/File.type";
import { MyShare } from "../../types/share.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import CopyTextField from "../upload/CopyTextField";

const showShareInformationsModal = (
  modals: ModalsContextProps,
  share: MyShare,
  appUrl: string,
  maxShareSize: number,
) => {
  const t = translateOutsideContext();
  const link = `${appUrl}/s/${share.id}`;

  let shareSize: number = 0;
  for (let file of share.files as FileMetaData[])
    shareSize += parseInt(file.size);

  const formattedShareSize = byteToHumanSizeString(shareSize);
  const formattedMaxShareSize = byteToHumanSizeString(maxShareSize);
  const shareSizeProgress = (shareSize / maxShareSize) * 100;

  const formattedCreatedAt = moment(share.createdAt).format("LLL");
  const formattedExpiration =
    moment(share.expiration).unix() === 0
      ? "Never"
      : moment(share.expiration).format("LLL");

  return modals.openModal({
    title: t("account.shares.modal.share-informations"),

    children: (
      <Stack align="stretch" spacing="md">
        <Text size="sm" color="lightgray">
          <b>
            <FormattedMessage id="account.shares.table.id" />:{" "}
          </b>
          {share.id}
        </Text>

        <Text size="sm" color="lightgray">
          <b>
            <FormattedMessage id="account.shares.table.description" />:{" "}
          </b>
          {share.description || "No description"}
        </Text>

        <Text size="sm" color="lightgray">
          <b>
            <FormattedMessage id="account.shares.table.createdAt" />:{" "}
          </b>
          {formattedCreatedAt}
        </Text>

        <Text size="sm" color="lightgray">
          <b>
            <FormattedMessage id="account.shares.table.expiresAt" />:{" "}
          </b>
          {formattedExpiration}
        </Text>
        <Divider />
        <CopyTextField link={link} />
        <Divider />
        <Text size="sm" color="lightgray">
          <b>
            <FormattedMessage id="account.shares.table.size" />:{" "}
          </b>
          {formattedShareSize} / {formattedMaxShareSize} (
          {shareSizeProgress.toFixed(1)}%)
        </Text>

        <Flex align="center" justify="center">
          {shareSize / maxShareSize < 0.1 && (
            <Text size="xs" color="lightgray" style={{ marginRight: "4px" }}>
              {formattedShareSize}
            </Text>
          )}
          <Progress
            value={shareSizeProgress}
            label={shareSize / maxShareSize >= 0.1 ? formattedShareSize : ""}
            style={{ width: shareSize / maxShareSize < 0.1 ? "70%" : "80%" }}
            size="xl"
            radius="xl"
          />
          <Text size="xs" color="lightgray" style={{ marginLeft: "4px" }}>
            {formattedMaxShareSize}
          </Text>
        </Flex>
      </Stack>
    ),
  });
};

export default showShareInformationsModal;
