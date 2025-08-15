"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { setDescription } from "@/store/createProblemSlice";

const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), {
  ssr: false,
});

export default function DescriptionTab() {
  const dispatch = useDispatch();
  const description = useSelector((state) => state.createProblem.description);

  const handleMarkdownChange = (markdown) => {
    dispatch(setDescription(markdown));
  };

  const safeMarkdown = typeof description === "string" ? description : "";

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <BlockNoteEditor onMarkdownChange={handleMarkdownChange} />
      </div>
      <div className="w-full lg:w-[40%] flex flex-col">
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
          Preview (Markdown)
        </h2>
        <div className="h-[76vh] border border-border rounded-lg bg-muted/30 p-4 overflow-auto text-sm whitespace-pre-wrap font-mono leading-relaxed">
          {safeMarkdown.trim()
            ? safeMarkdown
            : "Start typing in the editor to see markdown preview..."}
        </div>
      </div>
    </div>
  );
}
