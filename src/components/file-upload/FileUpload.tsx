import * as React from "react";
import { useState } from "react";
import { Check, TriangleAlert, ClockArrowUp } from "lucide-react";
import { DragArea, type DragAreaProps } from "./DragArea";
import { FileList } from "./FileList";
import { AutoFileIcon } from "./AutoFileIcon";
import type { UploadedFile } from "@/types/UploadedFile";
import { cn } from "@/lib/utils";
import { useUploadFiles } from "@/domain/jobs/hooks/use-upload-files";

interface FileUploadProps extends DragAreaProps {
  uploadEndpoint: string;
  value: UploadedFile[];
  enforceValue?: boolean;
  onChange?: (files: UploadedFile[]) => unknown;
}

interface PendingFile {
  name: string;
  error: boolean;
  file: File;
}

export const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { uploadEndpoint, value, onChange, enforceValue, ...rest } = props;

  const { uploadFiles } = useUploadFiles(uploadEndpoint);

  const [files, setFiles] = useState<(UploadedFile | PendingFile)[]>(() =>
    enforceValue ? value : []
  );

  // Helper function to update state and trigger onChange
  const updateState = (
    updateFn: (
      currentFiles: (UploadedFile | PendingFile)[]
    ) => (UploadedFile | PendingFile)[]
  ) => {
    setFiles((currentFiles) => {
      const newFiles = updateFn(currentFiles);

      if (onChange) {
        // Only pass the files that have finished uploading (i.e. have an id)
        const uploadedFiles = newFiles.filter(
          (file) => (file as UploadedFile).id !== undefined
        ) as UploadedFile[];

        onChange(uploadedFiles);
      }

      return newFiles;
    });
  };

  const onUpload = (newFiles: File[]) => {
    // Create pending files from the selected files
    const pendingFiles: PendingFile[] = newFiles.map((file) => ({
      file,
      name: file.name,
      error: false,
    }));

    // Append pending files using the updater so onChange is triggered
    updateState((prevFiles) => [...prevFiles, ...pendingFiles]);

    // Process each pending file upload using useMutation
    pendingFiles.forEach((pendingFile) => {
      uploadFiles.mutate(
        { file: pendingFile.file },
        {
          onSuccess: (result) => {
            // Replace the pending file with the uploaded file result
            updateState((currentFiles) =>
              currentFiles.map((currentFile) =>
                (currentFile as PendingFile).file === pendingFile.file
                  ? result
                  : currentFile
              )
            );
          },
          onError: () => {
            // Mark the pending file as errored if the upload fails
            updateState((currentFiles) =>
              currentFiles.map((currentFile) =>
                (currentFile as PendingFile).file === pendingFile.file
                  ? { ...currentFile, error: true }
                  : currentFile
              )
            );
          },
        }
      );
    });
  };

  const onRemove = (file: PendingFile | UploadedFile) => {
    updateState((prevFiles) =>
      (file as UploadedFile).id !== undefined
        ? prevFiles.filter(
            (f) => (f as UploadedFile).id !== (file as UploadedFile).id
          )
        : prevFiles.filter(
            (f) => (f as PendingFile).file !== (file as PendingFile).file
          )
    );
  };

  const classes = cn("m-0 p-0", props.className);

  return (
    <div className={classes} data-testid="file-upload">
      <DragArea {...rest} onUpload={onUpload} />
      <FileList>
        {files.map((file, idx) => {
          const isUploaded = (file as UploadedFile).id !== undefined;

          return (
            <FileList.Item
              key={idx}
              icon={AutoFileIcon(file.name)}
              onRemove={() => onRemove(file)}
            >
              <div className="truncate text-sm font-medium text-gray-900">
                {file.name}
              </div>
              {isUploaded ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (file as PendingFile).error ? (
                <span className="text-red-500 mx-2" title="Failed">
                  <TriangleAlert className="h-6 w-6" />
                </span>
              ) : (
                <span className="animate-pulse">
                  <ClockArrowUp className="h-6 w-6 text-blue-600" />
                </span>
              )}
            </FileList.Item>
          );
        })}
      </FileList>
    </div>
  );
};
