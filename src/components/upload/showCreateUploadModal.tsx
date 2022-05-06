import { Title } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import CreateUploadModalBody from "../share/CreateUploadModalBody";

const showCreateUploadModal = (
  mode: "standard" | "email",
  modals: ModalsContextProps,
  uploadCallback: (
    id: string,
    expiration: number,
    security: { password?: string; maxVisitors?: number}, emails? : string[]
  ) => void
) => {
  return modals.openModal({
    title: <Title order={4}>Share</Title>,
    children: (
      <CreateUploadModalBody mode={mode} uploadCallback={uploadCallback} />
    ),
  });
};

export default showCreateUploadModal;