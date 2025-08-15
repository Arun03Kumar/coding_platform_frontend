"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { setUserCode } from "@/store/problemSlice";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function CodeEditor() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.problem.language);
  const userCode = useSelector((state) => state.problem.userCode);

  const handleCodeChange = (value) => {
    dispatch(setUserCode(value || ""));
  };

  return (
    <div className="flex-1 min-h-0 border-b border-border">
      <MonacoEditor
        height="100%"
        language={(language || "java").toLowerCase()}
        theme="vs-dark"
        value={userCode}
        onChange={handleCodeChange}
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 8 },
        }}
      />
    </div>
  );
}
