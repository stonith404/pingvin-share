import { Appwrite } from "appwrite";

// SDK for client side (browser)
const aw = new Appwrite();

aw.setEndpoint(process.env["NEXT_PUBLIC_APPWRITE_HOST"] as string)
  .setProject("pingvin-share");

export default aw;
