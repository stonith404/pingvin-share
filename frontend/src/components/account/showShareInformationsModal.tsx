import { Text, Divider, Progress, Stack, Group, Flex } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { MyShare } from "../../types/share.type";
import moment from "moment";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import CopyTextField from "../upload/CopyTextField";
import { FileMetaData } from "../../types/File.type";

const showShareInformationsModal = (
  modals: ModalsContextProps,
  share: MyShare,
  appUrl: string,
  maxShareSize: number
) => {
  const link = `${appUrl}/share/${share.id}`;

  let shareSize: number = 0;
  for (let file of share.files as FileMetaData[])
    shareSize += parseInt(file.size);


  const formattedShareSize = byteToHumanSizeString(shareSize);
  const formattedMaxShareSize = byteToHumanSizeString(maxShareSize);
  const shareProgress = (shareSize / maxShareSize) * 100;

  const formattedCreatedAt = moment(share.createdAt).format("LLL");
  const formattedExpiration =
    moment(share.expiration).unix() === 0
      ? "Never"
      : moment(share.expiration).format("LLL");

  return modals.openModal({
    title: "Share informations",

    children: (
      <Stack align="stretch" spacing="md">
        <Text size="sm" color="lightgray">
          <b>ID:</b> {share.id}
        </Text>

        <Text size="sm" color="lightgray">
          <b>Creator:</b> You
        </Text>

        <Text size="sm" color="lightgray">
          <b>Description:</b> {share.description || "No description"}
        </Text>

        <Text size="sm" color="lightgray">
          <b>Created at:</b> {formattedCreatedAt}
        </Text>

        <Text size="sm" color="lightgray">
          <b>Expires at:</b> {formattedExpiration}
        </Text>

        <Divider />

        <CopyTextField link={link} />

        <Divider />

        <Text size="sm" color="lightgray">
          <b>Size:</b> {formattedShareSize} / {formattedMaxShareSize} (
          {shareProgress.toFixed(1)}%)
        </Text>

        <Flex align="center" justify="center">
          {shareSize / maxShareSize < 0.1 && (
            <Text size="xs" color="lightgray" style={{ marginRight: "4px" }}>
              {formattedShareSize}
            </Text>
          )}
          <Progress
            value={shareProgress}
            label={shareSize / maxShareSize >= 0.1 ? formattedShareSize : ""}
            color="blue"
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
