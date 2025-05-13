import { Anchor, Button, Center, createStyles, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import Markdown from "markdown-to-jsx";
import { Dropzone as MantineDropzone } from "@mantine/dropzone";
import { ForwardedRef, useRef } from "react";
import { TbCloudUpload, TbUpload } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import useTranslate from "../../hooks/useTranslate.hook";
import { FileUpload } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import toast from "../../utils/toast.util";
import useConfig from "../../hooks/config.hook";

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

  companysharingpolicy: {
    marginTop: 50,
    border: '1px dashed',
    borderWidth: 1,
    borderColor: theme.colorScheme === "dark"
    ? '#373A40'
    : '#ced4da',
    borderRadius: 10,
    backgroundColor: theme.colorScheme === "dark"
    ? theme.colors.dark[4]
    : theme.colors.gray[1],
    fontSize: 'small',
    textAlign: 'center',
    padding: 20,
  }
}));

const Dropzone = ({
  title,
  isUploading,
  maxShareSize,
  onFilesChanged,
}: {
  title?: string;
  isUploading: boolean;
  maxShareSize: number;
  onFilesChanged: (files: FileUpload[]) => void;
}) => {
  const t = useTranslate();
  const config = useConfig();
  const { colorScheme } = useMantineTheme();
  const hasCompanySharingPolicy = !!(
    config.get("legal.companySharingPolicy")
  );
  const companySharingPolicy = config.get("legal.companySharingPolicy");

  const { classes } = useStyles();
  const openRef = useRef<() => void>();
  return (
    <div className={classes.wrapper}>
      <MantineDropzone
        onReject={(e) => {
          toast.error(e[0].errors[0].message);
        }}
        disabled={isUploading}
        openRef={openRef as ForwardedRef<() => void>}
        onDrop={(files: FileUpload[]) => {
          const fileSizeSum = files.reduce((n, { size }) => n + size, 0);

          if (fileSizeSum > maxShareSize) {
            toast.error(
              t("upload.dropzone.notify.file-too-big", {
                maxSize: byteToHumanSizeString(maxShareSize),
              }),
            );
          } else {
            files = files.map((newFile) => {
              newFile.uploadingProgress = 0;
              return newFile;
            });
            onFilesChanged(files);
          }
        }}
        className={classes.dropzone}
        radius="md"
      >
        <div style={{ pointerEvents: "none" }}>
          <Group position="center">
            <TbCloudUpload size={50} />
          </Group>
          <Text align="center" weight={700} size="lg" mt="xl">
            {title || <FormattedMessage id="upload.dropzone.title" />}
          </Text>
          <Text align="center" size="sm" mt="xs" color="dimmed">
            <FormattedMessage
              id="upload.dropzone.description"
              values={{ maxSize: byteToHumanSizeString(maxShareSize) }}
            />
          </Text>
          {hasCompanySharingPolicy && (
          <Group className={classes.companysharingpolicy}>
            <Markdown
              options={{
                forceBlock: true,
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
                  a: {
                    props: {
                      target: "_blank",
                      rel: "noreferrer",
                    },
                    component: Anchor,
                  },
                },
              }}
            >
              {companySharingPolicy}
            </Markdown>
          </Group>
        )}
        </div>
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
          {<TbUpload />}
        </Button>
      </Center>
    </div>
  );
};
export default Dropzone;
