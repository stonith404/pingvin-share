import { Title } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { ShareSecurity } from "../../types/share.type";
import CreateUploadModalBody from "../share/CreateUploadModalBody";

const showCreateUploadModal = (
  modals: ModalsContextProps,
  uploadCallback: (
    id: string,
    expiration: string,
    security: ShareSecurity,
  ) => void
) => {
  return modals.openModal({
    title: <Title order={4}>Share</Title>,
    children: (
      <CreateUploadModalBody uploadCallback={uploadCallback} />
    ),
  });
};

export default showCreateUploadModal;
