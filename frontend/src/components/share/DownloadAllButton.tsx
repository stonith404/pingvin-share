import { Button, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import shareService from "../../services/share.service";

const DownloadAllButton = ({ shareId }: { shareId: string }) => {
  const [isZipReady, setIsZipReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const downloadAll = async () => {
    setIsLoading(true);
    await shareService
      .downloadFile(shareId, "zip")
      .then(() => setIsLoading(false));
  };

  useEffect(() => {
    shareService
      .getMetaData(shareId)
      .then((share) => setIsZipReady(share.isZipReady))
      .catch(() => {});

    const timer = setInterval(() => {
      shareService
        .getMetaData(shareId)
        .then((share) => {
          setIsZipReady(share.isZipReady);
          if (share.isZipReady) clearInterval(timer);
        })
        .catch(() => clearInterval(timer));
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!isZipReady)
    return (
      <Tooltip
        position="bottom"
        width={220}
        withArrow
        label="The share is preparing. This can take a few minutes."
      >
        <Button variant="outline" onClick={downloadAll} disabled>
          Download all
        </Button>
      </Tooltip>
    );
  return (
    <Button variant="outline" loading={isLoading} onClick={downloadAll}>
      Download all
    </Button>
  );
};

export default DownloadAllButton;
