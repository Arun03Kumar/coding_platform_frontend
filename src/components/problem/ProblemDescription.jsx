"use client";
import React from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

export default function ProblemDescription() {
  const problem = useSelector((state) => state.problem.data);
  const loading = useSelector((state) => state.problem.loading);
  const error = useSelector((state) => state.problem.error);

  const difficultyBadge = (diff) =>
    cn(
      "text-[10px] uppercase font-semibold px-2 py-1 rounded",
      diff === "easy" && "bg-emerald-500/15 text-emerald-500",
      diff === "medium" && "bg-amber-500/15 text-amber-500",
      diff === "hard" && "bg-rose-500/15 text-rose-500"
    );

  return (
    <section className="lg:w-[45%] xl:w-[40%] border-r border-border flex flex-col min-h-0">
      <div className="p-5 space-y-4 overflow-auto flex-1">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
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
              <ReactMarkdown
                components={{
                  // Custom components for better styling
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-3">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-medium mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed">{children}</p>
                  ),
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs font-mono mb-3">
                        <code>{children}</code>
                      </pre>
                    ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-muted-foreground pl-4 italic mb-3">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {DOMPurify.sanitize(problem.description || "")}
              </ReactMarkdown>
            </article>
          </>
        )}
      </div>
    </section>
  );
}
