import * as React from "react";
import { type ChangeEvent, type DragEvent, useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBoolean } from "@/shared/hooks/use-boolean";

export interface DragAreaProps {
  className?: string;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  /**
   * Mime type or extension
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   */
  accept?: string[];
  disabled?: boolean;
}

export const DragArea: React.FC<DragAreaProps> = (props) => {
  const {
    className,
    multiple = false,
    onUpload,
    accept = [],
    disabled = false,
  } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    value: isOver,
    setFalse: setIsOverFalse,
    setTrue: setIsOverTrue,
  } = useBoolean(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && onUpload) {
      onUpload(Array.from(files));
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsOverTrue();
  };

  const handleDragLeave = () => {
    setIsOverFalse();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsOverFalse();
    const files = e.dataTransfer.files;

    if (files && onUpload) {
      onUpload(Array.from(files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-gray-50 p-8 transition-colors",
        isOver && "border-primary bg-primary/5",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="h-12 w-12 text-gray-400" />
      <button
        className="text-primary underline hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        type="button"
        onClick={handleClick}
      >
        Browse
      </button>
      <input
        ref={fileInputRef}
        accept={accept.join(",")}
        className="hidden"
        data-testid="file-upload-input"
        disabled={disabled}
        multiple={multiple}
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};
