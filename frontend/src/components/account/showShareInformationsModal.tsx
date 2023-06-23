import { Stack, TextInput } from "@mantine/core";
import { Text, Badge, Divider } from '@mantine/core';
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { MyShare } from "../../types/share.type";
import moment from "moment";
import {byteToHumanSizeString} from "../../utils/fileSize.util";

const showShareInformationsModal = (
  modals: ModalsContextProps,
  share: MyShare,
  appUrl: string
) => {
  const link = `${appUrl}/share/${share.id}`;
  console.log(share)
  console.log(share.files)
  return modals.openModal({
    title: "Share informations",
    children: (
      <Stack align="stretch">
          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
            ID: {share.id}
          </Text>

          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
            Author: N/A
          </Text>

          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
            Created at: {moment(share.createdAt).format("LLL")}
          </Text>

          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
            Expires at: {moment(share.expiration).format("LLL")}
          </Text>

          <Divider style={{ margin: '1rem 0' }} />

          <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>

          </Text>

          <Divider style={{ margin: '1rem 0' }} />

      </Stack>
    ),
  });
};

export default showShareInformationsModal;
