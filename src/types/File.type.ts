import { Models } from "appwrite";

export type FileUpload = File & { uploadingState?: UploadState };
export type UploadState = "finished" | "inProgress" | undefined;

export interface AppwriteFileWithPreview extends Models.File {
  uploadingState?: UploadState;
  preview: Buffer;
}
