import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import shareService from "../../services/share.service";
import toast from "../../utils/toast.util";

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

  return (
    <Button
      variant="outline"
      loading={isLoading}
      onClick={() => {
        if (!isZipReady) {
          toast.error("分享正在准备中.几分钟后重试.");
        } else {
          downloadAll();
        }
      }}
    >
      全部下载
    </Button>
  );
};

export default DownloadAllButton;
