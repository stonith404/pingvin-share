import axios from "axios";
import { AppwriteFileWithPreview } from "../types/File.type";

const get = async (shareId: string, password?: string) => {
  return (
    await axios.post(`/api/share/${shareId}`, { password })
  ).data as AppwriteFileWithPreview[];
};

const authenticateWithPassword = async (shareId: string, password?: string) => {
  return (
    await axios.post(
      `/api/share/${shareId}/enterPassword`,
      { password }
    )
  ).data as AppwriteFileWithPreview[];
};

export default { get, authenticateWithPassword };
