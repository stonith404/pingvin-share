import QRCodeGenerator from "qrcode";
import { useState } from "react";
import CenterLoader from "../core/CenterLoader";

const QRCode = ({link}: {link: string}) => {
	const [qrCodeUrl, setQrCodeUrl] = useState<string>();
	QRCodeGenerator.toDataURL(link, {margin: 2, width: 400}).then(setQrCodeUrl);
	if(!qrCodeUrl) return <CenterLoader />
	return <img alt="qrcode" src={qrCodeUrl} />;
};

export default QRCode;
