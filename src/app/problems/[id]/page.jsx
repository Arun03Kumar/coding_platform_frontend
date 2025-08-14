"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { io } from "socket.io-client";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api/v1";

export default function ProblemDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("JAVA");
  const [userCode, setUserCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // left panel now only shows description; test cases moved below editor
  const [runOutput, setRunOutput] = useState(null);
  const [outputTab, setOutputTab] = useState("compile");

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/problems/${id}`);
        if (!res.ok) throw new Error("Failed to load problem");
        const data = await res.json();
        // API shape: { success, message, error, data: { ...problem } }
        const problemData = data?.data || data?.problem || data;
        if (active && problemData) {
          setProblem(problemData);
          const stub = problemData.codeStubs?.find(
            (s) => s.language === language
          );
          if (stub?.startSnippet) setUserCode(stub.startSnippet);
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, language]);

  useEffect(() => {
    const socket = io("http://localhost:3005");
    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("setUserId", "anonymous"); // Make sure userId is defined
    });
    socket.on("submissionPayloadResponse", (data) => {
      console.log("Received run output:", data);
      setRunOutput(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setRunOutput(null);
    try {
      // build submission payload; temporary dummy userId until auth is added
      const payload = {
        userId: "anonymous",
        problemId: id,
        code: userCode,
        language,
      };

      const res = await fetch(`http://localhost:3000/api/v1/submission/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      console.log("Run output:", data);
      setRunOutput(data);
    } catch (e) {
      console.error("Run error:", e);
      setRunOutput({ error: e.message });
    } finally {
      setIsRunning(false);
    }
  }, [id, userCode, language]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/problems/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: userCode, language }),
      });
      const data = await res.json().catch(() => ({}));
      setRunOutput(data);
    } catch (e) {
      setRunOutput({ error: e.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [id, userCode, language]);

  const difficultyBadge = (diff) =>
    cn(
      "text-[10px] uppercase font-semibold px-2 py-1 rounded",
      diff === "easy" && "bg-emerald-500/15 text-emerald-500",
      diff === "medium" && "bg-amber-500/15 text-amber-500",
      diff === "hard" && "bg-rose-500/15 text-rose-500"
    );

  return (
    <div className="flex flex-col h-full min-h-screen">
      <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-background/80 backdrop-blur sticky top-0 z-20">
        <h1 className="font-medium text-sm truncate flex-1">
          {problem?.title || "Problem"}
        </h1>
        <div className="flex items-center gap-2 mx-auto">
          <Button
            size="sm"
            variant="secondary"
            disabled={isRunning}
            onClick={handleRun}
          >
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button
            size="sm"
            variant="default"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={(v) => setLanguage(v)}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JAVA">JAVA</SelectItem>
              <SelectItem value="CPP">CPP</SelectItem>
              <SelectItem value="PYTHON">PYTHON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Left: description only */}
        <section className="lg:w-[45%] xl:w-[40%] border-r border-border flex flex-col min-h-0">
          <div className="p-5 space-y-4 overflow-auto flex-1">
            {loading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && !error && problem && (
              <>
                <div className="flex items-center gap-3">
                  <span className={difficultyBadge(problem.difficulty)}>
                    {problem.difficulty}
                  </span>
                </div>
                <h2 className="text-base font-semibold tracking-tight">
                  Description
                </h2>
                <article className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                  {problem.description?.split(/\n{2,}/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </article>
              </>
            )}
          </div>
        </section>
        {/* Right: editor, output, test cases */}
        <section className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 border-b border-border">
            <MonacoEditor
              height="100%"
              language={(language || "java").toLowerCase()}
              theme="vs-dark"
              value={userCode}
              onChange={(v) => setUserCode(v || "")}
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
          <div className="h-40 p-3 overflow-auto bg-muted/20 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOutputTab("compile")}
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
                    onClick={() => setOutputTab(`tc-${i}`)}
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

            {/* Output content for selected tab */}
            {outputTab === "compile" ? (
              <div className="text-xs whitespace-pre-wrap">
                {runOutput?.compile
                  ? typeof runOutput.compile === "string"
                    ? runOutput.compile
                    : JSON.stringify(runOutput.compile, null, 2)
                  : "No compilation output yet."}
              </div>
            ) : (
              (() => {
                const match = outputTab.match(/^tc-(\d+)$/);
                if (!match) return null;
                const idx = Number(match[1]);
                const tc = problem?.testCases?.[idx];
                const tcOutput = runOutput?.testcases?.[idx];
                return (
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground">
                        Input
                      </p>
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
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground">
                        Run Output
                      </p>
                      <pre className="whitespace-pre-wrap bg-background/30 p-2 rounded">
                        {tcOutput
                          ? typeof tcOutput === "string"
                            ? tcOutput
                            : JSON.stringify(tcOutput, null, 2)
                          : "No run output for this test yet."}
                      </pre>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
          {/* <div className="h-56 p-4 overflow-auto bg-muted/10">
            <p className="text-[11px] font-semibold mb-3 text-muted-foreground">
              All Test Cases
            </p>
            <ul className="space-y-3 text-xs">
              {problem?.testCases?.map((tc, idx) => (
                <li
                  key={idx}
                  className="border border-border rounded p-3 bg-background/60 font-mono"
                >
                  <p className="text-[10px] font-semibold mb-1 text-muted-foreground">
                    Input
                  </p>
                  <pre className="whitespace-pre-wrap">{tc.input}</pre>
                  <p className="text-[10px] font-semibold mt-2 mb-1 text-muted-foreground">
                    Output
                  </p>
                  <pre className="whitespace-pre-wrap">{tc.output}</pre>
                </li>
              ))}
              {(!problem?.testCases || problem.testCases.length === 0) && (
                <li className="text-muted-foreground">
                  No test cases provided.
                </li>
              )}
            </ul>
          </div> */}
        </section>
      </main>
    </div>
  );
}
