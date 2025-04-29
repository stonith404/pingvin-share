import { Button } from "@mantine/core";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import shareService from "../../services/share.service";

const DownloadAllButton = ({ shareId }: { shareId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadAll = async () => {
    setIsLoading(true);
    await shareService
      .downloadFile(shareId, "zip")
      .then(() => setIsLoading(false));
  };

  return (
    <Button
      variant="outline"
      loading={isLoading}
      onClick={() => downloadAll()}
    >
      <FormattedMessage id="share.button.download-all" />
    </Button>
  );
};

export default DownloadAllButton;
