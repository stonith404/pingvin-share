import {
  Button,
  Center,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import api from "../../services/api.service";
import Markdown from "markdown-to-jsx";
import useConfig from "../../hooks/config.hook";


const FilePreviewContext = React.createContext<{
  shareId: string;
  fileId: string;
  mimeType: string;
  setIsNotSupported: Dispatch<SetStateAction<boolean>>;
}>({
  shareId: "",
  fileId: "",
  mimeType: "",
  setIsNotSupported: () => {},
});

const FilePreview = ({
  shareId,
  fileId,
  mimeType,
}: {
  shareId: string;
  fileId: string;
  mimeType: string;
}) => {
  const [isNotSupported, setIsNotSupported] = useState(false);
  const config = useConfig();
  if (isNotSupported) return <UnSupportedFile />;
  return (
    <Stack>
      <FilePreviewContext.Provider
        value={{ shareId, fileId, mimeType, setIsNotSupported }}
      >
        <FileDecider />
      </FilePreviewContext.Provider>
      <Button
        variant="subtle"
        component={Link}
        onClick={() => modals.closeAll()}
        target="_blank"
        href={`${config.get("general.webroot")}/api/shares/${shareId}/files/${fileId}?download=false`}
      >
        View original file
        {/* Add translation? */}
      </Button>
    </Stack>
  );
};

const FileDecider = () => {
  const { mimeType, setIsNotSupported } = React.useContext(FilePreviewContext);

  if (mimeType == "application/pdf") {
    return <PdfPreview />;
  } else if (mimeType.startsWith("video/")) {
    return <VideoPreview />;
  } else if (mimeType.startsWith("image/")) {
    return <ImagePreview />;
  } else if (mimeType.startsWith("audio/")) {
    return <AudioPreview />;
  } else if (mimeType.startsWith("text/")) {
    return <TextPreview />;
  } else {
    setIsNotSupported(true);
    return null;
  }
};

const AudioPreview = () => {
  const { shareId, fileId, setIsNotSupported } =
    React.useContext(FilePreviewContext);
  return (
    <Center style={{ minHeight: 200 }}>
      <Stack align="center" spacing={10} style={{ width: "100%" }}>
        <audio controls style={{ width: "100%" }}>
          <source
            src={`/api/shares/${shareId}/files/${fileId}?download=false`}
            onError={() => setIsNotSupported(true)}
          />
        </audio>
      </Stack>
    </Center>
  );
};

const VideoPreview = () => {
  const { shareId, fileId, setIsNotSupported } =
    React.useContext(FilePreviewContext);
  return (
    <video width="100%" controls>
      <source
        src={`/api/shares/${shareId}/files/${fileId}?download=false`}
        onError={() => setIsNotSupported(true)}
      />
    </video>
  );
};

const ImagePreview = () => {
  const { shareId, fileId, setIsNotSupported } =
    React.useContext(FilePreviewContext);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/shares/${shareId}/files/${fileId}?download=false`}
      alt={`${fileId}_preview`}
      width="100%"
      onError={() => setIsNotSupported(true)}
    />
  );
};

const TextPreview = () => {
  const { shareId, fileId } = React.useContext(FilePreviewContext);
  const [text, setText] = useState<string>("");
  const { colorScheme } = useMantineTheme();

  useEffect(() => {
    api
      .get(`/shares/${shareId}/files/${fileId}?download=false`)
      .then((res) => setText(res.data ?? "Preview couldn't be fetched."));
  }, [shareId, fileId]);

  const options = {
    overrides: {
      pre: {
        props: {
          style: {
            backgroundColor:
              colorScheme == "dark"
                ? "rgba(50, 50, 50, 0.5)"
                : "rgba(220, 220, 220, 0.5)",
            padding: "0.75em",
            whiteSpace: "pre-wrap",
          },
        },
      },
      table: {
        props: {
          className: "md",
        },
      },
    },
  };

  return <Markdown options={options}>{text}</Markdown>;
};

const PdfPreview = () => {
  const { shareId, fileId } = React.useContext(FilePreviewContext);
  if (typeof window !== "undefined") {
    window.location.href = `/api/shares/${shareId}/files/${fileId}?download=false`;
  }
  return null;
};

const UnSupportedFile = () => {
  return (
    <Center style={{ minHeight: 200 }}>
      <Stack align="center" spacing={10}>
        <Title order={3}>
          <FormattedMessage id="share.modal.file-preview.error.not-supported.title" />
        </Title>
        <Text>
          <FormattedMessage id="share.modal.file-preview.error.not-supported.description" />
        </Text>
      </Stack>
    </Center>
  );
};

export default FilePreview;
