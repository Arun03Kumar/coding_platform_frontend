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

function CodeStubPanelComponent({ codeStub, setCodeStub }) {
  const [language, setLanguage] = useState(codeStub.language || "JAVA");

  // Keep local refs (NOT state) so typing doesn’t re-render parent / this component
  const starterRef = useRef(codeStub.startSnippet || "");
  const endRef = useRef(codeStub.endSnippet || "");

  const starterEditorRef = useRef(null);
  const endEditorRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const monacoLanguage = monacoLangMap[language] || "plaintext";

  const pushUp = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setCodeStub((prev) => ({
        ...prev,
        language,
        startSnippet: starterRef.current,
        endSnippet: endRef.current,
      }));
    }, DEBOUNCE_MS);
  }, [language, setCodeStub]);

  // Handle language change: just update Monaco models’ language (no remount)
  const updateLanguage = useCallback((newLang) => {
    setLanguage(newLang);
    // models persist; no flashing
  }, []);

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
      } else {
        endRef.current = editor.getValue();
      }
      pushUp();
    });
  };

  const handleStarterMount = (editor /*, monaco */) => {
    starterEditorRef.current = editor;
    editor.setValue(starterRef.current);
    attachChangeListener(editor, "starter");
  };

  const handleEndMount = (editor /*, monaco */) => {
    endEditorRef.current = editor;
    editor.setValue(endRef.current);
    attachChangeListener(editor, "end");
  };

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Language</p>
          <Select value={language} onValueChange={updateLanguage}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JAVA">JAVA</SelectItem>
              <SelectItem value="CPP">CPP</SelectItem>
              <SelectItem value="PYTHON">PYTHON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground max-w-md">
          Starter is visible to users; reference is internal. Autosaves
          (debounced {DEBOUNCE_MS}ms).
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Starter Snippet
          </span>
          <div className="border border-border rounded-lg overflow-hidden bg-muted/5 h-[60vh]">
            <MonacoEditor
              path={`starter-${language}`}
              defaultLanguage={monacoLanguage}
              theme="vs-dark"
              defaultValue={starterRef.current}
              onMount={handleStarterMount}
              options={commonOptions}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            Code skeleton shown to the user.
          </p>
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Reference Solution (End Snippet)
          </span>
          <div className="border border-border rounded-lg overflow-hidden bg-muted/5 h-[60vh]">
            <MonacoEditor
              path={`end-${language}`}
              defaultLanguage={monacoLanguage}
              theme="vs-dark"
              defaultValue={endRef.current}
              onMount={handleEndMount}
              options={commonOptions}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            Internal correct solution (not shown to users).
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(CodeStubPanelComponent);
