import {Text, Divider, Progress, Stack, Group, Flex} from '@mantine/core';
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
  const shareSize = 565564769; // TODO: get share size from backend
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
          <b>Description :</b> {share.description || "No description"}
        </Text>

        <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
          <b>Created at :</b> {moment(share.createdAt).format("LLL")}
        </Text>

        <Text size="sm" color="lightgray">
          <b>Expires at :</b> {moment(share.expiration).unix() === 0
                                          ? "Never"
                                          : moment(share.expiration).format("LLL")}
        </Text>

        <Divider style={{ margin: '.5rem 0' }} />

        <CopyTextField link={link} />

        <Divider style={{ margin: '1rem 0' }} />

        <Text size="sm" color="lightgray" style={{ marginBottom: '0.5rem' }}>
          <span>
            <b>Size :</b> {byteToHumanSizeString(shareSize)} / {byteToHumanSizeString(maxShareSize)}
          </span>

          { /* Faire un flex pour aligner le Progress et le text à droite */}

          <Flex justify="center" direction={{base: 'row'}} align="center" style={{alignItems: "center", marginTop: "1rem"}}>
            { (shareSize / maxShareSize < 0.1) && (
              <Text size="xs" color="lightgray" style={{ marginRight: '4px'}}>
                {byteToHumanSizeString(shareSize)}
              </Text>
            ) }
            <Progress
              value={((shareSize / maxShareSize) * 100)}
              label={(shareSize / maxShareSize >= 0.1) ? (byteToHumanSizeString(shareSize)) : ""}
              color="blue"
              style={{ width: (shareSize / maxShareSize < 0.1) ? '70%' : '80%' }}
              size="xl"
              radius="xl"

            />
            <Text size="xs" color="lightgray" style={{ marginLeft: '4px'}}>
              {byteToHumanSizeString(maxShareSize)}
            </Text>
          </Flex>



        </Text>

      </Stack>
    ),
  });
};

export default showShareInformationsModal;
