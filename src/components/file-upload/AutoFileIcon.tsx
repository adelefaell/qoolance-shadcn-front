import * as React from "react";
import {
  FileImage,
  FileSpreadsheet,
  FileText,
  File,
  FileArchive,
  FileVideo,
  Presentation,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AutoFileIcon = (filename: string): React.ReactNode => {
  const parts = filename.split(".");
  const ext = parts[parts.length - 1]?.toLowerCase() || "";

  const iconProps = {
    className: cn("h-4 w-4"),
  };

  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "tiff":
    case "svg":
      return <FileImage {...iconProps} />;
    case "xls":
    case "xlsx":
    case "ods":
      return <FileSpreadsheet {...iconProps} />;
    case "doc":
    case "docx":
    case "odt":
      return <FileText {...iconProps} />;
    case "pdf":
      return <File {...iconProps} />;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FileArchive {...iconProps} />;
    case "mov":
    case "avi":
    case "mp4":
    case "mpeg":
    case "wmv":
    case "mkv":
    case "webm":
    case "flv":
      return <FileVideo {...iconProps} />;
    case "txt":
      return <FileText {...iconProps} />;
    case "csv":
      return <FileSpreadsheet {...iconProps} />;
    case "ppt":
    case "pptx":
    case "odp":
      return <Presentation {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
};
