import { setCookie } from "cookies-next";
import { FileUploadResponse } from "../types/File.type";
import {
  CreateShare,
  MyShare,
  Share,
  ShareMetaData,
} from "../types/share.type";
import api from "./api.service";

const create = async (share: CreateShare) => {
  const { id, expiration, recipients, security, description } = share;
  return (
    await api.post("shares", {
      id,
      expiration,
      recipients,
      security,
      description,
    })
  ).data;
};

const completeShare = async (id: string) => {
  return (await api.post(`shares/${id}/complete`)).data;
};

const get = async (id: string): Promise<Share> => {
  const shareToken = sessionStorage.getItem(`share_${id}_token`);
  return (
    await api.get(`shares/${id}`, {
      headers: { "X-Share-Token": shareToken ?? "" },
    })
  ).data;
};

const getMetaData = async (id: string): Promise<ShareMetaData> => {
  const shareToken = sessionStorage.getItem(`share_${id}_token`);
  return (
    await api.get(`shares/${id}/metaData`, {
      headers: { "X-Share-Token": shareToken ?? "" },
    })
  ).data;
};

const remove = async (id: string) => {
  await api.delete(`shares/${id}`);
};

const getMyShares = async (): Promise<MyShare[]> => {
  return (await api.get("shares")).data;
};

const getShareToken = async (id: string, password?: string) => {
  const { token } = (await api.post(`/shares/${id}/token`, { password })).data;

  sessionStorage.setItem(`share_${id}_token`, token);
};

const isShareIdAvailable = async (id: string): Promise<boolean> => {
  return (await api.get(`shares/isShareIdAvailable/${id}`)).data.isAvailable;
};

const getFileDownloadUrl = async (shareId: string, fileId: string) => {
  const shareToken = sessionStorage.getItem(`share_${shareId}_token`);
  return (
    await api.get(`shares/${shareId}/files/${fileId}/download`, {
      headers: { "X-Share-Token": shareToken ?? "" },
    })
  ).data.url;
};

const downloadFile = async (shareId: string, fileId: string) => {
  window.location.href = await getFileDownloadUrl(shareId, fileId);
};

const uploadFile = async (
  shareId: string,
  readerEvent: ProgressEvent<FileReader>,
  file: {
    id?: string;
    name: string;
  },
  chunkIndex: number,
  totalChunks: number
): Promise<FileUploadResponse> => {
  const data = readerEvent.target!.result;

  return (
    await api.post(`shares/${shareId}/files`, data, {
      headers: { "Content-Type": "application/octet-stream" },
      params: {
        id: file.id,
        name: file.name,
        chunkIndex,
        totalChunks,
      },
    })
  ).data;
};

const createReverseShareToken = async (expiration: string) => {
  return (await api.post("/shares/reverseShareToken", { expiration })).data;
};

const setReverseShareToken = async (reverseShareToken: string) => {
  const { isValid } = (
    await api.get(`/shares/reverseShareToken/${reverseShareToken}`)
  ).data;

  if (!isValid) throw "Reverse share token is invalid";

  setCookie("reverse_share_token", reverseShareToken);
};

export default {
  create,
  completeShare,
  getShareToken,
  get,
  remove,
  getMetaData,
  getMyShares,
  isShareIdAvailable,
  downloadFile,
  uploadFile,
  setReverseShareToken,
  createReverseShareToken,
};
