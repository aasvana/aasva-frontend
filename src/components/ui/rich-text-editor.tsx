"use client";

import * as React from "react";
import {
  Bold,
  Code,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  Link2Off,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
}

type ActiveFormats = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  formatBlock: string;
};

type ToolbarItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  isActive?: (formats: ActiveFormats) => boolean;
};

const BLOCK_TAGS = ["h1", "h2", "h3", "blockquote", "pre"];

const blockTag = (value: string) =>
  value.trim().toLowerCase().replace(/[<>]/g, "");

function toPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>|<\/div>|<\/li>|<li>/gi, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  className,
  invalid,
  disabled,
  id,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const valueRef = React.useRef(value);
  const isComposingRef = React.useRef(false);
  const [formats, setFormats] = React.useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    orderedList: false,
    unorderedList: false,
    formatBlock: "p",
  });

  React.useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value;
      valueRef.current = value;
    }
  }, [value]);

  const emit = React.useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = toPlainText(el.innerHTML) === "" ? "" : el.innerHTML;
    if (html !== valueRef.current) {
      valueRef.current = html;
      onChange?.(html);
    }
    if (!html && !isComposingRef.current) {
      el.innerHTML = "";
    }
  }, [onChange]);

  const readFormats = React.useCallback(() => {
    const el = editorRef.current;
    const doc = el?.ownerDocument;
    if (!el || !doc) return;
    setFormats((prev) => {
      const next: ActiveFormats = {
        bold: doc.queryCommandState("bold"),
        italic: doc.queryCommandState("italic"),
        underline: doc.queryCommandState("underline"),
        strike: doc.queryCommandState("strikeThrough"),
        orderedList: doc.queryCommandState("insertOrderedList"),
        unorderedList: doc.queryCommandState("insertUnorderedList"),
        formatBlock: blockTag(doc.queryCommandValue("formatBlock")) || "p",
      };
      return Object.keys(next).every(
        (key) =>
          (prev as Record<string, string | boolean>)[key] ===
          (next as Record<string, string | boolean>)[key]
      )
        ? prev
        : next;
    });
  }, []);

  React.useEffect(() => {
    const el = editorRef.current;
    const doc = el?.ownerDocument;
    if (!el || !doc) return;
    doc.addEventListener("selectionchange", readFormats);
    el.addEventListener("keyup", readFormats);
    el.addEventListener("mouseup", readFormats);
    el.addEventListener("blur", readFormats);
    return () => {
      doc.removeEventListener("selectionchange", readFormats);
      el.removeEventListener("keyup", readFormats);
      el.removeEventListener("mouseup", readFormats);
      el.removeEventListener("blur", readFormats);
    };
  }, [readFormats]);

  const exec = React.useCallback(
    (command: string, cmdValue?: string) => {
      const el = editorRef.current;
      const doc = el?.ownerDocument;
      if (!el || !doc || disabled) return;
      el.focus();
      doc.execCommand(command, false, cmdValue);
      emit();
      readFormats();
    },
    [disabled, emit, readFormats]
  );

  const createLink = React.useCallback(() => {
    const url = window.prompt("Enter the link URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  const clearFormatting = React.useCallback(() => {
    exec("removeFormat");
    exec("formatBlock", "P");
  }, [exec]);

  const toolbar: (ToolbarItem | "separator")[] = [
    { key: "undo", label: "Undo", icon: Undo2, action: () => exec("undo") },
    { key: "redo", label: "Redo", icon: Redo2, action: () => exec("redo") },
    "separator",
    {
      key: "paragraph",
      label: "Paragraph",
      icon: Pilcrow,
      action: () => exec("formatBlock", "P"),
      isActive: (f) => !BLOCK_TAGS.includes(f.formatBlock),
    },
    {
      key: "h1",
      label: "Heading 1",
      icon: Heading1,
      action: () => exec("formatBlock", "H1"),
      isActive: (f) => f.formatBlock === "h1",
    },
    {
      key: "h2",
      label: "Heading 2",
      icon: Heading2,
      action: () => exec("formatBlock", "H2"),
      isActive: (f) => f.formatBlock === "h2",
    },
    {
      key: "h3",
      label: "Heading 3",
      icon: Heading3,
      action: () => exec("formatBlock", "H3"),
      isActive: (f) => f.formatBlock === "h3",
    },
    "separator",
    {
      key: "bold",
      label: "Bold",
      icon: Bold,
      action: () => exec("bold"),
      isActive: (f) => f.bold,
    },
    {
      key: "italic",
      label: "Italic",
      icon: Italic,
      action: () => exec("italic"),
      isActive: (f) => f.italic,
    },
    {
      key: "underline",
      label: "Underline",
      icon: Underline,
      action: () => exec("underline"),
      isActive: (f) => f.underline,
    },
    {
      key: "strike",
      label: "Strikethrough",
      icon: Strikethrough,
      action: () => exec("strikeThrough"),
      isActive: (f) => f.strike,
    },
    "separator",
    {
      key: "orderedList",
      label: "Ordered list",
      icon: ListOrdered,
      action: () => exec("insertOrderedList"),
      isActive: (f) => f.orderedList,
    },
    {
      key: "unorderedList",
      label: "Unordered list",
      icon: List,
      action: () => exec("insertUnorderedList"),
      isActive: (f) => f.unorderedList,
    },
    "separator",
    {
      key: "blockquote",
      label: "Blockquote",
      icon: Quote,
      action: () => exec("formatBlock", "BLOCKQUOTE"),
      isActive: (f) => f.formatBlock === "blockquote",
    },
    {
      key: "code",
      label: "Code block",
      icon: Code,
      action: () => exec("formatBlock", "PRE"),
      isActive: (f) => f.formatBlock === "pre",
    },
    { key: "link", label: "Insert link", icon: Link, action: createLink },
    {
      key: "unlink",
      label: "Remove link",
      icon: Link2Off,
      action: () => exec("unlink"),
    },
    "separator",
    {
      key: "clear",
      label: "Clear formatting",
      icon: Eraser,
      action: clearFormatting,
    },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-xs transition-[color,box-shadow] focus-within:border-emerald-400 focus-within:ring-emerald-100 focus-within:ring-[3px] dark:bg-input/30",
        invalid && "border-destructive",
        disabled && "opacity-60",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-1.5 py-1">
        {toolbar.map((item, index) =>
          item === "separator" ? (
            <div
              key={`separator-${index}`}
              className="mx-1 h-5 w-px shrink-0 bg-border"
            />
          ) : (
            <Button
              key={item.key}
              type="button"
              variant="ghost"
              size="icon"
              title={item.label}
              aria-label={item.label}
              aria-pressed={item.isActive?.(formats)}
              disabled={disabled}
              className={cn(
                "h-8 w-8",
                item.isActive?.(formats) && "bg-accent text-accent-foreground"
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={item.action}
            >
              <item.icon />
            </Button>
          )
        )}
      </div>
      <div
        ref={editorRef}
        id={id}
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        spellCheck="true"
        data-placeholder={placeholder}
        className="rte-content min-h-80 cursor-text px-4 py-3 text-sm text-foreground outline-none"
        onInput={emit}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
          emit();
        }}
      />
    </div>
  );
}
