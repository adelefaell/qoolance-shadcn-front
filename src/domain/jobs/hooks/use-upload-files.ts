import type { UploadedFile } from "@/types/UploadedFile";

interface UploadFilesParams {
  file: File;
}

interface UploadFilesResponse extends UploadedFile {}

interface UploadFilesOptions {
  onSuccess?: (result: UploadFilesResponse) => void;
  onError?: (error: Error) => void;
}

export function useUploadFiles(uploadEndpoint: string) {
  const mutate = async (
    { file }: UploadFilesParams,
    options?: UploadFilesOptions
  ): Promise<void> => {
    try {
      // For now, just console.log the file
      console.log("Uploading file:", file.name, "to endpoint:", uploadEndpoint);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return a mock response
      const result: UploadFilesResponse = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
      };

      options?.onSuccess?.(result);
    } catch (error) {
      options?.onError?.(error as Error);
    }
  };

  return { uploadFiles: { mutate } };
}
