"use client";

import { useRef } from "react";
import styles from "../cards.module.css";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolButton {
  id: string;
  label: string;
  title: string;
  cmd?: string;
  arg?: string;
  isActive?: (val: string) => boolean;
}

interface ToolGroup {
  dividerBefore?: boolean;
  buttons: ToolButton[];
}

const toolGroups: ToolGroup[] = [
  {
    buttons: [
      { id: "undo", label: "↶", title: "Undo", cmd: "undo" },
      { id: "redo", label: "↷", title: "Redo", cmd: "redo" },
    ],
  },
  {
    dividerBefore: true,
    buttons: [
      { id: "bold", label: "B", title: "Bold", cmd: "bold", isActive: (v) => v === "bold" },
      { id: "italic", label: "I", title: "Italic", cmd: "italic", isActive: (v) => v === "italic" },
      { id: "underline", label: "U", title: "Underline", cmd: "underline", isActive: (v) => v === "underline" },
      { id: "strike", label: "S", title: "Strikethrough", cmd: "strikeThrough", isActive: (v) => v === "strikeThrough" },
    ],
  },
  {
    dividerBefore: true,
    buttons: [
      { id: "h1", label: "H1", title: "Heading 1", cmd: "formatBlock", arg: "<h2>" },
      { id: "h2", label: "H2", title: "Heading 2", cmd: "formatBlock", arg: "<h3>" },
      { id: "p", label: "¶", title: "Paragraph", cmd: "formatBlock", arg: "<p>" },
    ],
  },
  {
    dividerBefore: true,
    buttons: [
      { id: "alignLeft", label: "L", title: "Align left", cmd: "justifyLeft", isActive: (v) => v === "justifyLeft" },
      { id: "alignCenter", label: "C", title: "Align center", cmd: "justifyCenter", isActive: (v) => v === "justifyCenter" },
      { id: "alignRight", label: "R", title: "Align right", cmd: "justifyRight", isActive: (v) => v === "justifyRight" },
    ],
  },
  {
    dividerBefore: true,
    buttons: [
      { id: "ul", label: "• List", title: "Bullet list", cmd: "insertUnorderedList", isActive: (v) => v === "insertUnorderedList" },
      { id: "ol", label: "1. List", title: "Ordered list", cmd: "insertOrderedList", isActive: (v) => v === "insertOrderedList" },
    ],
  },
  {
    dividerBefore: true,
    buttons: [
      { id: "link", label: "🔗", title: "Insert link", cmd: "link" },
      { id: "clear", label: "🧹", title: "Remove formatting", cmd: "removeFormat" },
    ],
  },
];

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);

  const exec = (tool: ToolButton) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();

    if (tool.cmd === "link") {
      const url = window.prompt("Enter link URL", "https://");
      if (url) {
        document.execCommand("createLink", false, url);
      } else {
        return;
      }
    } else if (tool.cmd === "formatBlock") {
      document.execCommand("formatBlock", false, tool.arg as string);
    } else {
      document.execCommand(tool.cmd as string, false);
    }

    const html = el.innerHTML;
    if (html !== lastHtml.current) {
      lastHtml.current = html;
      onChange(html);
    }
  };

  const isActive = (tool: ToolButton): boolean => {
    if (tool.isActive && tool.cmd) {
      try {
        const state = document.queryCommandState(tool.cmd);
        return typeof state === "boolean" ? state : false;
      } catch {
        return false;
      }
    }
    return false;
  };

  return (
    <div className={styles.richEditorWrap}>
      <div className={styles.richToolbar}>
        {toolGroups.map((group, gi) => (
          <span
            key={gi}
            className={`${styles.richToolGroup} ${group.dividerBefore ? styles.richToolGroupDivider : ""}`}
          >
            {group.buttons.map((tool) => (
              <button
                key={tool.id}
                type="button"
                title={tool.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  exec(tool);
                }}
                className={`${styles.richToolBtn} ${isActive(tool) ? styles.richToolBtnActive : ""}`}
              >
                {tool.label}
              </button>
            ))}
          </span>
        ))}
      </div>
      <div
        ref={editorRef}
        className={styles.richEditor}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder ?? "Describe this card…"}
        onInput={(e) => {
          const html = (e.currentTarget as HTMLDivElement).innerHTML;
          lastHtml.current = html;
          onChange(html);
        }}
        dangerouslySetInnerHTML={{ __html: lastHtml.current }}
      />
    </div>
  );
}
