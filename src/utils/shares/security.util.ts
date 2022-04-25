import { scryptSync } from "crypto";
import { SecurityDocument, ShareDocument } from "../../types/Appwrite.type";
import awServer from "../appwriteServer.util";

export const hashPassword = (password: string, salt: string) => {
  return scryptSync(password, salt, 64).toString("hex");
};

export const checkSecurity = async (
  shareId: string,
  hashedPassword?: string
) => {
  const shareDocument = await awServer.database.getDocument<ShareDocument>(
    "shares",
    shareId
  );
  if (!shareDocument.securityID) return;
  await awServer.database
    .getDocument<SecurityDocument>("shareSecurity", shareDocument.securityID)
    .then((securityDocument) => {
      if (securityDocument.maxVisitors) {
        if (shareDocument.visitorCount > securityDocument.maxVisitors) {
          throw "visitor_limit_exceeded";
        }
      }
      if (securityDocument.password) {
        if (!hashedPassword) throw "password_required";

        if (hashedPassword !== securityDocument.password) {
          throw "wrong_password";
        }
      }
    });
  return { hashedPassword };
};
