"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TestCasesPanel({ testCases, setTestCases }) {
  const updateField = (index, field, value) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  };

  const addTestCase = () => {
    setTestCases((prev) => [...prev, { input: "", output: "" }]);
  };

  return (
    <div className="h-[80vh] flex flex-col border border-border rounded-lg bg-background shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/40">
        <h2 className="text-sm font-medium">Test Cases</h2>
        <p className="text-xs text-muted-foreground">
          Provide sample inputs and expected outputs. They will be used to
          validate user solutions.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-6">
        {testCases.map((tc, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border/60 bg-muted/10 p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Test Case #{idx + 1}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Input
                </label>
                <Textarea
                  value={tc.input}
                  onChange={(e) => updateField(idx, "input", e.target.value)}
                  placeholder="Enter input..."
                  className="resize-none h-32 text-sm font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Output
                </label>
                <Textarea
                  value={tc.output}
                  onChange={(e) => updateField(idx, "output", e.target.value)}
                  placeholder="Enter expected output..."
                  className="resize-none h-32 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        ))}
        {testCases.length === 0 && (
          <div className="text-xs text-muted-foreground">
            No test cases yet. Click Add Test Case to begin.
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/70 backdrop-blur px-4 py-3">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={addTestCase}
        >
          Add Test Case
        </Button>
      </div>
    </div>
  );
}
