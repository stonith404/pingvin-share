import { Appwrite } from "appwrite";

// SDK for client side (browser)
const aw = new Appwrite();

aw.setEndpoint("http://localhost:86/v1")
  .setProject("pingvin-share");

export default aw;
