import { Models } from "appwrite";

export type FileUpload = File & { uploadingState?: UploadState };
export type UploadState = "finished" | "inProgress" | undefined;

export type AppwriteFileWithPreview = Models.File & { preview: Buffer };

