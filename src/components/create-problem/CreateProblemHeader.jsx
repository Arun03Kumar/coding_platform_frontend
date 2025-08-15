"use client";
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  setActiveTab,
  setIsEditingTitle,
  setTitle,
  setDifficulty,
  publishProblem,
} from "@/store/createProblemSlice";

export default function CreateProblemHeader() {
  const dispatch = useDispatch();
  const titleInputRef = useRef(null);

  const {
    activeTab,
    title,
    isEditingTitle,
    difficulty,
    description,
    testCases,
    codeStub,
    isPublishing,
  } = useSelector((state) => state.createProblem);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      const len = titleInputRef.current.value.length;
      titleInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditingTitle]);

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
          language: codeStub.language.toUpperCase(),
          startSnippet: codeStub.startSnippet || "",
          endSnippet: codeStub.endSnippet || "",
        });
      }
    }

    return {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      testCases: cleanedTestCases,
      codeStubs,
      editorial: "",
    };
  };

  const handlePublish = () => {
    // Basic client-side validation
    if (!title.trim()) {
      console.error("Title required");
      return;
    }
    if (!description.trim()) {
      console.error("Description required");
      return;
    }

    const payload = buildProblemPayload();
    dispatch(publishProblem(payload));
  };

  const isPublishDisabled =
    isPublishing ||
    !title.trim() ||
    (activeTab === "description" && !description.trim());

  return (
    <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Difficulty */}
          <Select
            value={difficulty}
            onValueChange={(v) => dispatch(setDifficulty(v))}
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
              variant={activeTab === "description" ? "default" : "secondary"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => dispatch(setActiveTab("description"))}
            >
              Problem Description
            </Button>
            <Button
              type="button"
              variant={activeTab === "testcases" ? "default" : "secondary"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => dispatch(setActiveTab("testcases"))}
            >
              Test Cases
            </Button>
            <Button
              type="button"
              variant={activeTab === "codestub" ? "default" : "secondary"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => dispatch(setActiveTab("codestub"))}
            >
              Code Stub
            </Button>
          </div>

          {/* Editable Title */}
          <div className="flex-1 min-w-0">
            {!isEditingTitle ? (
              <h1
                className="text-sm font-medium text-muted-foreground truncate cursor-pointer"
                onDoubleClick={() => dispatch(setIsEditingTitle(true))}
                title="Double click to edit title"
              >
                {title}
              </h1>
            ) : (
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => dispatch(setTitle(e.target.value))}
                onBlur={() => dispatch(setIsEditingTitle(false))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    dispatch(setIsEditingTitle(false));
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
          disabled={isPublishDisabled}
        >
          {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </header>
  );
}
