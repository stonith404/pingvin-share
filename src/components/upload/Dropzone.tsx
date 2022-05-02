import {
  Button,
  Center,
  createStyles,
  Group,
  MantineTheme,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone as MantineDropzone, DropzoneStatus } from "@mantine/dropzone";
import React, { Dispatch, ForwardedRef, SetStateAction, useRef } from "react";
import { CloudUpload, Upload } from "tabler-icons-react";
import { useConfig } from "../../utils/config.util";
import toast from "../../utils/toast.util";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    bottom: -20,
  },
}));

function getActiveColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[2]
    : theme.black;
}

const Dropzone = ({
  isUploading,
  setFiles,
}: {
  isUploading: boolean;
  setFiles: Dispatch<SetStateAction<File[]>>;
}) => {
  const theme = useMantineTheme();
  const config = useConfig();
  const { classes } = useStyles();
  const openRef = useRef<() => void>();
  return (
    <div className={classes.wrapper}>
      <MantineDropzone
        maxSize={config.MAX_FILE_SIZE}
        onReject={(e) => {
          toast.error(e[0].errors[0].message);
        }}
        disabled={isUploading}
        openRef={openRef as ForwardedRef<() => void>}
        onDrop={(files) => {
          if (files.length > 100) {
            toast.error("You can't upload more than 100 files per share.");
          } else {
            setFiles(files);
          }
        }}
        className={classes.dropzone}
        radius="md"
      >
        {(status) => (
          <div style={{ pointerEvents: "none" }}>
            <Group position="center">
              <CloudUpload size={50} color={getActiveColor(status, theme)} />
            </Group>
            <Text
              align="center"
              weight={700}
              size="lg"
              mt="xl"
              sx={{ color: getActiveColor(status, theme) }}
            >
              {status.accepted ? "Drop files here" : "Upload files"}
            </Text>
            <Text align="center" size="sm" mt="xs" color="dimmed">
              Drag and drop your files or use the upload button to start your
              share.
            </Text>
          </div>
        )}
      </MantineDropzone>
      <Center>
        <Button
          className={classes.control}
          variant="light"
          size="sm"
          radius="xl"
          disabled={isUploading}
          onClick={() => openRef.current && openRef.current()}
        >
          {<Upload />}
        </Button>
      </Center>
    </div>
  );
};
export default Dropzone;
