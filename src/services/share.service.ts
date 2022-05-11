import axios from "axios";
import { AppwriteFileWithPreview } from "../types/File.type";

const get = async (shareId: string, password?: string) => {
  return (await axios.post(`/api/share/${shareId}`, { password }))
    .data as AppwriteFileWithPreview[];
};

const remove = async (shareId: string) => {
  await axios.delete(`/api/share/${shareId}`);
};

const isIdAlreadyInUse = async (shareId: string) => {
  return (await axios.get(`/api/share/${shareId}/exists`)).data
    .exists as boolean;
};

const doesUserExist = async (email: string) => {
  return (await axios.get(`/api/user/exists/${email}`)).data.exists as boolean;
};

const authenticateWithPassword = async (shareId: string, password?: string) => {
  return (await axios.post(`/api/share/${shareId}/enterPassword`, { password }))
    .data as AppwriteFileWithPreview[];
};

export default {
  get,
  remove,
  authenticateWithPassword,
  isIdAlreadyInUse,
  doesUserExist,
};
