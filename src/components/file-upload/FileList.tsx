import * as React from "react";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileListProps = PropsWithChildren<
  {
    children?: ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  } & HTMLAttributes<HTMLDivElement>
>;

const FileList: React.FC<FileListProps> = (props) => {
  const { className, ref, ...rest } = props;

  const classes = cn("flex flex-col gap-2", className);

  return (
    <div className={classes} {...rest} ref={ref}>
      {props.children}
    </div>
  );
};

type FileListItemFC = React.FC<
  PropsWithChildren<{
    icon?: ReactNode;
    onRemove?: () => unknown;
  }>
>;

const FileListItem: FileListItemFC = (props) => {
  const { icon, children, onRemove } = props;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-green-50 px-4 py-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && <span className="shrink-0 text-green-600">{icon}</span>}
        <div className="flex items-center gap-2 flex-1 min-w-0">{children}</div>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100 shrink-0"
          data-testid="file-list-close"
          type="button"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const FileListNamespace = Object.assign(FileList, {
  Item: FileListItem,
});

export { FileListNamespace as FileList };
