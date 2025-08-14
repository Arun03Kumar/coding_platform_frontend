"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// dynamic imports
const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), {
  ssr: false,
});
const TestCasesPanel = dynamic(() => import("@/components/TestCasesPanel"), {
  ssr: false,
});
const CodeStubPanel = dynamic(() => import("@/components/CodeStubPanel"), {
  ssr: false,
});

export default function CreateProblem() {
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description | testcases | codestub
  const [markdown, setMarkdown] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const [title, setTitle] = useState(
    "Title of Problem (double click to change)"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef(null);

  const [difficulty, setDifficulty] = useState("easy");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  // NEW: code stub state
  const [codeStub, setCodeStub] = useState({
    language: "JAVA",
    startSnippet: "",
    endSnippet: "",
  });

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      const len = titleInputRef.current.value.length;
      titleInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditingTitle]);

  // ---- Helper: build request body matching your Mongoose schema ----
  const buildProblemPayload = () => {
    // Clean test cases: keep only rows where BOTH input & output have content
    const cleanedTestCases = testCases
      .map((tc) => ({
        input: (tc.input || "").trim(),
        output: (tc.output || "").trim(),
      }))
      .filter((tc) => tc.input && tc.output);

    // Build codeStubs array (schema expects an array)
    const codeStubs = [];
    if (codeStub.language) {
      const hasAnySnippet =
        (codeStub.startSnippet && codeStub.startSnippet.trim()) ||
        (codeStub.endSnippet && codeStub.endSnippet.trim());

      if (hasAnySnippet) {
        codeStubs.push({
          language: codeStub.language.toUpperCase(), // JAVA | CPP | PYTHON
          startSnippet: codeStub.startSnippet || "",
          endSnippet: codeStub.endSnippet || "",
          // userSnippet intentionally omitted (user will fill later)
        });
      }
    }

    return {
      title: title.trim(),
      description: markdown.trim(), // markdown from BlockNote
      difficulty, // easy | medium | hard
      testCases: cleanedTestCases, // [{input, output}, ...]
      codeStubs, // [{language,startSnippet,endSnippet}]
      editorial: "", // (add if you later collect it)
    };
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Basic client-side validation
      if (!title.trim()) throw new Error("Title required");
      if (!markdown.trim()) throw new Error("Description required");
      const payload = buildProblemPayload();

      console.log("Publish payload:", payload);

      const res = await fetch("http://localhost:3001/api/v1/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to publish");
      }

      const created = await res.json();
      console.log("Created problem:", created);
      // TODO: navigate or show success toast
    } catch (e) {
      console.error("Publish failed:", e);
      // TODO: show user-facing error (toast/snackbar)
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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Difficulty */}
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

              {/* Tab Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant={
                    activeTab === "description" ? "default" : "secondary"
                  }
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setActiveTab("description")}
                >
                  Problem Description
                </Button>
                <Button
                  type="button"
                  variant={activeTab === "testcases" ? "default" : "secondary"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setActiveTab("testcases")}
                >
                  Test Cases
                </Button>
                <Button
                  type="button"
                  variant={activeTab === "codestub" ? "default" : "secondary"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setActiveTab("codestub")}
                >
                  Code Stub
                </Button>
              </div>

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
                      if (e.key === "Enter" || e.key === "Escape") {
                        setIsEditingTitle(false);
                      }
                    }}
                    className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring"
                  />
                )}
              </div>
            </div>

            {/* Publish */}
            <Button
              variant="default"
              size="sm"
              onClick={handlePublish}
              disabled={
                isPublishing ||
                !title.trim() ||
                (activeTab === "description" && !safeMarkdown.trim())
              }
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
            {activeTab === "description" && (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">
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
            )}
            {activeTab === "testcases" && (
              <TestCasesPanel
                testCases={testCases}
                setTestCases={setTestCases}
              />
            )}
            {activeTab === "codestub" && (
              <CodeStubPanel codeStub={codeStub} setCodeStub={setCodeStub} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
