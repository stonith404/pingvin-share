import {useRef, useState} from "react";
import toast from "../../utils/toast.util";
import {ActionIcon, TextInput} from "@mantine/core";
import {TbCheck, TbCopy} from "react-icons/tb";
import {useClipboard} from "@mantine/hooks";

function CopyTextField(props: { link: string })
{

    const clipboard = useClipboard({ timeout: 500 });
    const [checkState, setCheckState] = useState(false);
    const timerRef = useRef<number | ReturnType<typeof setTimeout> | undefined>(
        undefined
    );

    const copyLink = () => {
        clipboard.copy(props.link);
        toast.success("Your link was copied to the keyboard.");
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setCheckState(false);
        }, 1500);
        setCheckState(true);
    };


    return(
        <TextInput
            readOnly
            label="Link"
            variant="filled"
            value={props.link}
            onClick={copyLink}
            rightSection={
                window.isSecureContext && (
                    <ActionIcon onClick={copyLink}>
                        {checkState ? <TbCheck /> : <TbCopy />}
                    </ActionIcon>
                )
            }
        />
    )
}

export default CopyTextField;