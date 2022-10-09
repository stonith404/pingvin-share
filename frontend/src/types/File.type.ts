export type FileUpload = File & { uploadingState?: UploadState };
export type UploadState = "finished" | "inProgress" | undefined;
