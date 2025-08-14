"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// shadcn select
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[75vh] mt-8 p-8 rounded-lg border border-border bg-background text-sm text-muted-foreground flex items-center justify-center">
      Loading editor...
    </div>
  ),
});

export default function CreateProblem() {
  const [showEditor, setShowEditor] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const [title, setTitle] = useState(
    "Title of Problem (double click to change)"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef(null);

  // NEW: difficulty state
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      const len = titleInputRef.current.value.length;
      titleInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditingTitle]);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      console.log("Publish title:", title);
      console.log("Difficulty:", difficulty);
      console.log("Publish markdown:\n", markdown);
      // await fetch("/api/problems", {method:"POST", body: JSON.stringify({ title, difficulty, markdown })});
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  const safeMarkdown = typeof markdown === "string" ? markdown : "";

  return (
    <div className="flex flex-col w-full min-h-screen">
      {showEditor && (
        <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur border-b border-border">
          <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between gap-4">
            {/* Left side controls */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Editable Title */}
              <div className="flex-1 min-w-0">
                {!isEditingTitle ? (
                  <h1
                    className="text-sm font-medium text-muted-foreground truncate cursor-pointer"
                    onDoubleClick={() => setIsEditingTitle(true)}
                    title="Double click to edit title"
                  >
                    {title}
                  </h1>
                ) : (
                  <input
                    ref={titleInputRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape")
                        setIsEditingTitle(false);
                    }}
                    className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring"
                  />
                )}
              </div>
              {/* Difficulty Select */}
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v)}
              >
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Test Cases Button */}
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => console.log("Open Test Cases")}
              >
                Test Cases
              </Button>

              {/* Code Stub Button */}
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => console.log("Open Code Stub")}
              >
                Code Stub
              </Button>
            </div>

            {/* Right side publish */}
            <Button
              variant="default"
              size="sm"
              onClick={handlePublish}
              disabled={isPublishing || !safeMarkdown.trim()}
            >
              {isPublishing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </header>
      )}

      <main className="flex-1 px-6 py-8">
        {!showEditor ? (
          <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Create a Question
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 min-w-0">
                <dynamic
                // placeholder: dynamic is already defined above as BlockNoteEditor
                />
                <BlockNoteEditor onMarkdownChange={setMarkdown} />
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
          </div>
        )}
      </main>
    </div>
  );
}
