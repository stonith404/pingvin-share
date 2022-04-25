import type { NextApiRequest, NextApiResponse } from "next";
import { ShareDocument } from "../../../../types/Appwrite.type";
import { AppwriteFileWithPreview } from "../../../../types/File.type";
import awServer from "../../../../utils/appwriteServer.util";
import { checkSecurity } from "../../../../utils/shares/security.util";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const shareId = req.query.shareId as string;
  const fileList: AppwriteFileWithPreview[] = [];
  const hashedPassword = req.cookies[`${shareId}-password`];

  if (!(await shareExists(shareId)))
    return res.status(404).json({ message: "not_found" });

  try {
    await checkSecurity(shareId, hashedPassword);
  } catch (e) {
    return res.status(403).json({ message: e });
  }

  addVisitorCount(shareId);

  const fileListWithoutPreview = (await awServer.storage.listFiles(shareId))
    .files;

  for (const file of fileListWithoutPreview) {
    const filePreview = await awServer.storage.getFilePreview(
      shareId,
      file.$id
    );
    fileList.push({ ...file, preview: filePreview });
  }

  if (hashedPassword)
    res.setHeader(
      "Set-Cookie",
      `${shareId}-password=${hashedPassword}; Path=/share/${shareId}; max-age=3600; HttpOnly`
    );
  res.status(200).json(fileList);
};

const shareExists = async (shareId: string) => {
  try {
    const shareDocument = await awServer.database.getDocument<ShareDocument>(
      "shares",
      shareId
    );
    return shareDocument.enabled && shareDocument.expiresAt > Date.now();
  } catch (e) {
    return false;
  }
};

const addVisitorCount = async (shareId: string) => {
  const currentDocument = await awServer.database.getDocument<ShareDocument>(
    "shares",
    shareId
  );
  currentDocument.visitorCount++;

  awServer.database.updateDocument("shares", shareId, currentDocument);
};

export default handler;
