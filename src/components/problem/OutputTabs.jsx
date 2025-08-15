"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { setOutputTab } from "@/store/runOutputSlice";
import TestCaseTab from "./TestCaseTab";

export default function OutputTabs() {
  const dispatch = useDispatch();
  const problem = useSelector((state) => state.problem.data);
  const runOutput = useSelector((state) => state.runOutput.data);
  const outputTab = useSelector((state) => state.runOutput.outputTab);

  const handleTabChange = (tab) => {
    dispatch(setOutputTab(tab));
  };

  const renderCompileTab = () => {
    if (!runOutput) return "Run code to view results.";

    const firstError = runOutput?.response?.find((r) => r.status === "ERROR");
    if (firstError) return firstError.output || "Error.";
    return "No compilation error.";
  };

  return (
    <div className="h-40 p-3 overflow-auto bg-muted/20 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange("compile")}
            className={cn(
              "text-xs px-3 py-1 rounded-md",
              outputTab === "compile"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground bg-transparent"
            )}
          >
            Compile
          </button>
          {(problem?.testCases || []).slice(0, 3).map((tc, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(`tc-${i}`)}
              className={cn(
                "text-xs px-3 py-1 rounded-md",
                outputTab === `tc-${i}`
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground bg-transparent"
              )}
            >
              {`Test ${i + 1}`}
            </button>
          ))}
        </div>
        <p className="text-[11px] font-semibold text-muted-foreground">
          Run / Submit Output
        </p>
      </div>

      {outputTab === "compile" ? (
        <div className="text-xs whitespace-pre-wrap">{renderCompileTab()}</div>
      ) : (
        <TestCaseTab />
      )}
    </div>
  );
}
