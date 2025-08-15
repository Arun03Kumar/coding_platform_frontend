"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Monaco (uncontrolled to prevent re-mount flash each keypress)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
      Loading code editor...
    </div>
  ),
});

const monacoLangMap = {
  JAVA: "java",
  CPP: "cpp",
  PYTHON: "python",
};

const DEBOUNCE_MS = 500;

function EnhancedCodeStubPanelComponent({
  codeStubs,
  currentLanguage,
  onLanguageChange,
  onCodeStubUpdate,
}) {
  const prevLanguageRef = useRef(currentLanguage);
  
  // Get current language code stub or initialize empty
  const currentStub = codeStubs[currentLanguage] || {
    startSnippet: "",
    endSnippet: "",
    userSnippet: "",
  };

  // Keep local refs for current editor content
  const starterRef = useRef(currentStub.startSnippet || "");
  const endRef = useRef(currentStub.endSnippet || "");
  const userRef = useRef(currentStub.userSnippet || "");

  const starterEditorRef = useRef(null);
  const endEditorRef = useRef(null);
  const userEditorRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const monacoLanguage = monacoLangMap[currentLanguage] || "plaintext";

  // Handle language change - only update when language actually changes
  useEffect(() => {
    if (prevLanguageRef.current !== currentLanguage) {
      const newStub = codeStubs[currentLanguage] || {
        startSnippet: "",
        endSnippet: "",
        userSnippet: "",
      };

      // Update refs
      starterRef.current = newStub.startSnippet || "";
      endRef.current = newStub.endSnippet || "";
      userRef.current = newStub.userSnippet || "";

      // Update editors if mounted
      if (starterEditorRef.current) {
        starterEditorRef.current.setValue(starterRef.current);
      }
      if (endEditorRef.current) {
        endEditorRef.current.setValue(endRef.current);
      }
      if (userEditorRef.current) {
        userEditorRef.current.setValue(userRef.current);
      }

      prevLanguageRef.current = currentLanguage;
    }
  }, [currentLanguage, codeStubs]);

  const pushUp = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onCodeStubUpdate(currentLanguage, {
        startSnippet: starterRef.current,
        endSnippet: endRef.current,
        userSnippet: userRef.current,
      });
    }, DEBOUNCE_MS);
  }, [currentLanguage, onCodeStubUpdate]);

  const commonOptions = {
    fontSize: 13,
    minimap: { enabled: false },
    automaticLayout: true,
    wordWrap: "on",
    padding: { top: 8, bottom: 8 },
    scrollBeyondLastLine: false,
    smoothScrolling: true,
  };

  const attachChangeListener = (editor, which) => {
    editor.onDidChangeModelContent(() => {
      if (which === "starter") {
        starterRef.current = editor.getValue();
      } else if (which === "end") {
        endRef.current = editor.getValue();
      } else if (which === "user") {
        userRef.current = editor.getValue();
      }
      pushUp();
    });
  };

  const handleStarterMount = (editor) => {
    starterEditorRef.current = editor;
    editor.setValue(starterRef.current);
    attachChangeListener(editor, "starter");
  };

  const handleEndMount = (editor) => {
    endEditorRef.current = editor;
    editor.setValue(endRef.current);
    attachChangeListener(editor, "end");
  };

  const handleUserMount = (editor) => {
    userEditorRef.current = editor;
    editor.setValue(userRef.current);
    attachChangeListener(editor, "user");
  };

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Header with language selector */}
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Language</p>
          <Select value={currentLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JAVA">Java</SelectItem>
              <SelectItem value="CPP">C++</SelectItem>
              <SelectItem value="PYTHON">Python</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            Configure code stubs for{" "}
            <span className="font-medium">{currentLanguage}</span>. Each
            language can have different code stubs. Auto-saves after{" "}
            {DEBOUNCE_MS}ms.
          </p>
        </div>
      </div>

      {/* Three-column editor layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Starter Snippet */}
        <div className="flex flex-col min-w-0 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Starter Code
            </span>
            <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
          </div>
          <div className="border border-border rounded-lg overflow-hidden bg-muted/5 h-[45vh]">
            <MonacoEditor
              path={`starter-${currentLanguage}`}
              language={monacoLanguage}
              theme="vs-dark"
              defaultValue={starterRef.current}
              onMount={handleStarterMount}
              options={commonOptions}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            Initial code template shown to users
          </p>
        </div>

        {/* User Snippet */}
        <div className="flex flex-col min-w-0 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              User Code Area
            </span>
            <div className="h-1 w-1 bg-green-500 rounded-full"></div>
          </div>
          <div className="border border-border rounded-lg overflow-hidden bg-muted/5 h-[45vh]">
            <MonacoEditor
              path={`user-${currentLanguage}`}
              language={monacoLanguage}
              theme="vs-dark"
              defaultValue={userRef.current}
              onMount={handleUserMount}
              options={commonOptions}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            Where users write their solution code
          </p>
        </div>

        {/* Reference Solution */}
        <div className="flex flex-col min-w-0 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Reference Solution
            </span>
            <div className="h-1 w-1 bg-amber-500 rounded-full"></div>
          </div>
          <div className="border border-border rounded-lg overflow-hidden bg-muted/5 h-[45vh]">
            <MonacoEditor
              path={`end-${currentLanguage}`}
              language={monacoLanguage}
              theme="vs-dark"
              defaultValue={endRef.current}
              onMount={handleEndMount}
              options={commonOptions}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            Internal correct solution (not shown to users)
          </p>
        </div>
      </div>

      {/* Language status indicator */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Configured languages:
        </span>
        <div className="flex items-center gap-2">
          {Object.keys(codeStubs).map((lang) => (
            <div
              key={lang}
              className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                lang === currentLanguage
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {lang}
            </div>
          ))}
          {Object.keys(codeStubs).length === 0 && (
            <span className="text-xs text-muted-foreground italic">
              None configured yet
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(EnhancedCodeStubPanelComponent);
