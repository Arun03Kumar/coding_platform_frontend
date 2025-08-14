"use client";

import React, { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";

/*
Goal:
- Keep editor at a fixed viewport height (e.g. 80vh)
- Allow internal scrolling when content grows
- Prevent overall page from stretching
- Avoid white background bleed
Key points:
- Parent: fixed height + flex + overflow-hidden
- Inner wrapper: flex-1 min-h-0 (allows child to actually scroll)
- BlockNoteView: force height 100% + its internal editable area scrollable
*/

export default function BlockNoteEditor({ onMarkdownChange }) {
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (!editor) return;
    // Subscribe to changes
    const off = editor.onChange(async () => {
      try {
        const md = await editor.blocksToMarkdownLossy(editor.document);
        onMarkdownChange?.(md);
        // console.log("Current markdown:", md);
      } catch (e) {
        onMarkdownChange?.("");
      }
    });
    return () => {
      off?.();
    };
  }, [editor, onMarkdownChange]);

  return (
    <div
      className="
        h-[80vh]   
        w-[45%]     /* fixed editor area height */
        flex flex-col
        rounded-lg border border-border bg-background
        shadow-sm overflow-hidden
      "
    >
      <div className="flex-1 min-h-0">
        <BlockNoteView
          editor={editor}
          className="
            h-full w-full
            overflow-auto
            /* Make internal editor fill & scroll */
            [&_.bn-editor]:h-full
            [&_.bn-editor]:overflow-auto
            [&_.bn-root]:bg-transparent
            [&_.bn-root]:dark:bg-transparent
          "
        />
      </div>
    </div>
  );
}
