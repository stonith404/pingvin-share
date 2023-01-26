import { setCookie } from "cookies-next";
import { FileUploadResponse } from "../types/File.type";
import {
  CreateShare,
  MyReverseShare,
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
  return (await api.get(`shares/${id}`)).data;
};

const getMetaData = async (id: string): Promise<ShareMetaData> => {
  return (await api.get(`shares/${id}/metaData`)).data;
};

const remove = async (id: string) => {
  await api.delete(`shares/${id}`);
};

const getMyShares = async (): Promise<MyShare[]> => {
  return (await api.get("shares")).data;
};

const getShareToken = async (id: string, password?: string) => {
  await api.post(`/shares/${id}/token`, { password });
};

const isShareIdAvailable = async (id: string): Promise<boolean> => {
  return (await api.get(`shares/isShareIdAvailable/${id}`)).data.isAvailable;
};

const downloadFile = async (shareId: string, fileId: string) => {
  window.location.href = `${window.location.origin}/api/shares/${shareId}/files/${fileId}`;
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

const createReverseShare = async (
  shareExpiration: string,
  maxShareSize: number,
  sendEmailNotification: boolean
) => {
  return (
    await api.post("reverseShares", {
      shareExpiration,
      maxShareSize: maxShareSize.toString(),
      sendEmailNotification,
    })
  ).data;
};

const getMyReverseShares = async (): Promise<MyReverseShare[]> => {
  return (await api.get("reverseShares")).data;
};

const setReverseShare = async (reverseShareToken: string) => {
  const { data } = await api.get(`/reverseShares/${reverseShareToken}`);
  setCookie("reverse_share_token", reverseShareToken);
  return data;
};

const removeReverseShare = async (id: string) => {
  await api.delete(`/reverseShares/${id}`);
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
  setReverseShare,
  createReverseShare,
  getMyReverseShares,
  removeReverseShare,
};
