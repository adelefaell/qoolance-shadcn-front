import * as React from "react";
import { CheckIcon, ChevronDownIcon, XIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export type AutoCompleteId = string | number;

export interface AutoCompleteItem {
  id: AutoCompleteId;
  name: string;
}

interface MultiSelectProps {
  error?: string | false;
  id: string;
  label?: string;
  options: AutoCompleteItem[];
  onChange?: (values: AutoCompleteItem[]) => void;
  onInputChange?: (text: string) => void;
  value?: AutoCompleteItem[];
  disableDelete?: AutoCompleteId[];
  required?: boolean;
  singleSelect?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxHeight?: number;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

export function MultiSelect({
  error,
  id,
  label,
  options,
  onChange,
  onInputChange,
  value = [],
  disableDelete = [],
  required = false,
  singleSelect = false,
  isLoading = false,
  disabled = false,
  placeholder,
  className,
  maxHeight = 300,
  emptyMessage,
  searchPlaceholder,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedIds = React.useMemo(
    () => value.map((item) => item.id),
    [value]
  );

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) {
      return options.filter((option) => !selectedIds.includes(option.id));
    }

    return options
      .filter((option) => !selectedIds.includes(option.id))
      .filter((option) =>
        option.name.toLowerCase().includes(searchValue.toLowerCase())
      );
  }, [options, searchValue, selectedIds]);

  const handleSelect = React.useCallback(
    (item: AutoCompleteItem) => {
      if (singleSelect) {
        onChange?.(item ? [item] : []);
      } else {
        onChange?.(item ? [...value, item] : []);
      }
      setSearchValue("");
      if (singleSelect) {
        setOpen(false);
      }
    },
    [onChange, value, singleSelect]
  );

  const handleRemove = React.useCallback(
    (item: AutoCompleteItem) => {
      if (disabled || disableDelete.includes(item.id)) return;
      onChange?.(value.filter((v) => v.id !== item.id));
    },
    [onChange, value, disabled, disableDelete]
  );

  // Call onInputChange when search value changes
  React.useEffect(() => {
    onInputChange?.(searchValue);
  }, [searchValue, onInputChange]);

  const displayPlaceholder = placeholder || label || "Select items...";

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label || "Select items"}
            disabled={disabled}
            className={cn(
              "w-full justify-between min-h-9 h-auto",
              error && "border-destructive",
              value.length > 0 && "h-auto py-1"
            )}
            onClick={() => !disabled && setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {value.length === 0 ? (
                <span className="text-muted-foreground text-sm">
                  {displayPlaceholder}
                </span>
              ) : (
                value.map((item) => (
                  <Badge
                    key={item.id}
                    variant="secondary"
                    className="mr-1 mb-1 text-xs font-normal"
                  >
                    {item.name}
                    {!disabled && !disableDelete.includes(item.id) && (
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleRemove(item);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                        aria-label={`Remove ${item.name}`}
                        data-testid="delete"
                      >
                        <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    )}
                  </Badge>
                ))
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isLoading && (
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder || "Search..."}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList style={{ maxHeight: `${maxHeight}px` }}>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : filteredOptions.length === 0 ? (
                <CommandEmpty>
                  {emptyMessage ||
                    (searchValue ? "No results found." : "Type to search...")}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id.toString()}
                      onSelect={() => handleSelect(option)}
                      className="cursor-pointer"
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedIds.includes(option.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span>{option.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <p
          className="text-sm font-medium text-destructive"
          id={`${id}-error`}
          role="alert"
          data-testid="error-message"
        >
          {error}
        </p>
      )}
    </div>
  );
}
