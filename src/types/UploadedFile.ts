export interface UploadedFile {
  id: string | number;
  name: string;
  url?: string;
  [key: string]: unknown;
}
