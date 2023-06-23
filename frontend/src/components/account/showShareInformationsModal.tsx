import {Text, Divider, Progress, Stack, Group} from '@mantine/core';
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { MyShare } from "../../types/share.type";
import moment from "moment";
import {byteToHumanSizeString} from "../../utils/fileSize.util";
import CopyTextField from "../upload/CopyTextField";

const showShareInformationsModal = (
  modals: ModalsContextProps,
  share: MyShare,
  appUrl: string,
  maxShareSize: number | string
) => {
  const link = `${appUrl}/share/${share.id}`;
  const shareSize = 165564769; // TODO: get share size from backend
  if (typeof maxShareSize === "string") {
    maxShareSize = parseInt(maxShareSize);
  }
  return modals.openModal({
    title: "Share informations",

    children: (
      <Stack align="stretch">
          <Text size="sm" color="lightgray" style={{ margin: '0.5rem 0' }}>
            <b>ID:</b> {share.id}
          </Text>

          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
            <b>Creator :</b> You
          </Text>

          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
            <b>Created at :</b> {moment(share.createdAt).format("LLL")}
          </Text>

          <Text size="sm" color="lightgray">
            <b>Expires at :</b> {moment(share.expiration).format("LLL")}
          </Text>

          <Divider style={{ margin: '.5rem 0' }} />

          <CopyTextField link={link} />

          <Divider style={{ margin: '1rem 0' }} />

          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
            <b>Size :</b> {byteToHumanSizeString(shareSize)} / {byteToHumanSizeString(maxShareSize)}
            <Progress
              value={((shareSize / maxShareSize) * 100)}
              label={byteToHumanSizeString(shareSize)}
              color="blue"
              style={{ marginTop: '0.5rem' }}
              size="xl"
              radius="xl"
            >
              <Group
                position="right">
                <Text size="sm" color="lightgray" style={{ marginRight: '0.5rem' }}>
                  {byteToHumanSizeString(maxShareSize)}
                </Text>
              </Group>
            </Progress>
          </Text>

      </Stack>
    ),
  });
};

export default showShareInformationsModal;
