import { ActionIcon, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useRef, useState } from "react";
import { TbCheck, TbCopy } from "react-icons/tb";
import useTranslate from "../../hooks/useTranslate.hook";
import toast from "../../utils/toast.util";

function CopyTextField(props: { link: string }) {
  const clipboard = useClipboard({ timeout: 500 });
  const t = useTranslate();

  const [checkState, setCheckState] = useState(false);
  const [textClicked, setTextClicked] = useState(false);
  const timerRef = useRef<number | ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const copyLink = () => {
    clipboard.copy(props.link);
    toast.success(t("common.notify.copied"));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCheckState(false);
    }, 1500);
    setCheckState(true);
  };

  return (
    <TextInput
      readOnly
      label={t("common.text.link")}
      variant="filled"
      value={props.link}
      onClick={() => {
        if (!textClicked) {
          copyLink();
          setTextClicked(true);
        }
      }}
      rightSection={
        window.isSecureContext && (
          <ActionIcon onClick={copyLink}>
            {checkState ? <TbCheck /> : <TbCopy />}
          </ActionIcon>
        )
      }
    />
  );
}

export default CopyTextField;
