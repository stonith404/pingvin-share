import { Button, Center, createStyles, Group, Text } from "@mantine/core";
import { Dropzone as MantineDropzone } from "@mantine/dropzone";
import { Dispatch, ForwardedRef, SetStateAction, useRef } from "react";
import { TbCloudUpload, TbUpload } from "react-icons/tb";
import useConfig from "../../hooks/config.hook";
import { FileUpload } from "../../types/File.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
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

const Dropzone = ({
  isUploading,
  maxShareSize,
  files,
  setFiles,
}: {
  isUploading: boolean;
  maxShareSize: number;
  files: FileUpload[];
  setFiles: Dispatch<SetStateAction<FileUpload[]>>;
}) => {
  const config = useConfig();

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
        onDrop={(newFiles: FileUpload[]) => {
          const fileSizeSum = [...newFiles, ...files].reduce(
            (n, { size }) => n + size,
            0
          );

          if (fileSizeSum > maxShareSize) {
            toast.error(
              `您的文件超过了的最大共享大小 ${byteToHumanSizeString(
                maxShareSize
              )}.`
            );
          } else {
            newFiles = newFiles.map((newFile) => {
              newFile.uploadingProgress = 0;
              return newFile;
            });
            setFiles([...newFiles, ...files]);
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
            上传文件
          </Text>
          <Text align="center" size="sm" mt="xs" color="dimmed">
            拖动 或 选择 文件放在此处开始共享。我们可以接受仅限小于 {byteToHumanSizeString(maxShareSize)}{" "}
            的文件.
          </Text>
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
