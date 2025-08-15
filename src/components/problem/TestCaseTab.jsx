"use client";
import React from "react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

export default function TestCaseTab() {
  const problem = useSelector((state) => state.problem.data);
  const runOutput = useSelector((state) => state.runOutput.data);
  const outputTab = useSelector((state) => state.runOutput.outputTab);

  const match = outputTab.match(/^tc-(\d+)$/);
  if (!match) return null;

  const idx = Number(match[1]);
  const tc = problem?.testCases?.[idx];
  const resp = runOutput?.response?.[idx];
  const status = resp?.status;
  const isSuccess = status === "SUCCESS";
  const isError = status === "ERROR";

  const statusClass = isSuccess
    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
    : isError
    ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
    : "bg-amber-500/15 text-amber-500 border border-amber-500/30";

  return (
    <div className="space-y-2 text-xs">
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground">Input</p>
        <pre className="whitespace-pre-wrap bg-background/30 p-2 rounded">
          {tc?.input ?? "-"}
        </pre>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground">
          Expected Output
        </p>
        <pre className="whitespace-pre-wrap bg-background/30 p-2 rounded">
          {tc?.output ?? "-"}
        </pre>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-semibold text-muted-foreground">
          Run Output
        </p>
        {status && (
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded",
              statusClass
            )}
          >
            {status}
          </span>
        )}
      </div>
      <pre className="whitespace-pre-wrap bg-background/30 p-2 rounded">
        {resp
          ? resp.output ??
            (typeof resp === "string" ? resp : JSON.stringify(resp, null, 2))
          : "No run output for this test yet."}
      </pre>
    </div>
  );
}
