"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { setMarkdownText } from "@/store/createProblemSlice";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

export default function MarkdownTab() {
  const dispatch = useDispatch();
  const markdownText = useSelector((state) => state.createProblem.markdownText);

  const handleMarkdownChange = (e) => {
    dispatch(setMarkdownText(e.target.value));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
          Markdown Input
        </h2>
        <Textarea
          value={markdownText}
          onChange={handleMarkdownChange}
          placeholder="Paste your markdown here..."
          className="h-[76vh] resize-none font-mono text-sm"
        />
      </div>
      <div className="w-full lg:w-[40%] flex flex-col">
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
          Preview
        </h2>
        <div className="h-[76vh] border border-border rounded-lg bg-muted/30 p-4 overflow-auto">
          {markdownText.trim() ? (
            <article className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
              <ReactMarkdown
                components={{
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
                {DOMPurify.sanitize(markdownText)}
              </ReactMarkdown>
            </article>
          ) : (
            <p className="text-sm text-muted-foreground">
              Start typing markdown to see the preview...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
