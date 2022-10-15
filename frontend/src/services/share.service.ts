import {
  MyShare,
  Share,
  ShareMetaData,
  ShareSecurity,
} from "../types/share.type";
import api from "./api.service";

const create = async (
  id: string,
  expiration: string,
  security?: ShareSecurity
) => {
  return (await api.post("shares", { id, expiration, security })).data;
};

const completeShare = async (id: string) => {
  return (await api.post(`shares/${id}/complete`)).data;
};

const get = async (id: string): Promise<Share> => {
  const shareToken = localStorage.getItem(`share_${id}_token`);
  return (
    await api.get(`shares/${id}`, {
      headers: { "X-Share-Token": shareToken ?? "" },
    })
  ).data;
};

const getMetaData = async (id: string): Promise<ShareMetaData> => {
  const shareToken = localStorage.getItem(`share_${id}_token`);
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

  localStorage.setItem(`share_${id}_token`, token);
};

const isShareIdAvailable = async (id: string): Promise<boolean> => {
  return (await api.get(`shares/isShareIdAvailable/${id}`)).data.isAvailable;
};

const getFileDownloadUrl = async (shareId: string, fileId: string) => {
  const shareToken = localStorage.getItem(`share_${shareId}_token`);
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
  file: File,
  progressCallBack: (uploadingProgress: number) => void
) => {
  let formData = new FormData();
  formData.append("file", file);

  return (
    await api.post(`shares/${shareId}/files`, formData, {
      onUploadProgress: (progressEvent) =>
        progressCallBack(progressEvent.loaded),
    })
  ).data;
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
};
