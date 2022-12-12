import {
    Accordion,
    Alert,
    Button,
    Checkbox,
    Col,
    Grid,
    Group,
    MultiSelect,
    NumberInput,
    PasswordInput,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {useForm, yupResolver} from "@mantine/form";
import {useModals} from "@mantine/modals";
import {ModalsContextProps} from "@mantine/modals/lib/context";
import {useState} from "react";
import {TbAlertCircle} from "react-icons/tb";
import * as yup from "yup";
import shareService from "../../../services/share.service";
import {ShareSecurity} from "../../../types/share.type";
import ExpirationPreview from "../ExpirationPreview";
import showCreateUploadModal from "../upload/modals/showCreateUploadModal";

const showEnableTotpModal = (
    modals: ModalsContextProps,
    options: {
        qrCode: string;
        secret: string;
    }
) => {
    return modals.openModal({
        title: <Title order={4}>Enable TOTP</Title>,
        children: (
            <CreateEnableTotpModal
                options={options}
            />
        )
    });
};

const CreateEnableTotpModal = ({
    options,
}: {
    options: {
        qrCode: string;
        secret: string;
    };
}) => {
    const modals = useModals();


    return (
        <div>
            <img src={options.qrCode} alt=""/>
        </div>
    )
}

export default showEnableTotpModal;
