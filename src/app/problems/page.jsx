"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PROBLEM_API_BASE || "http://localhost:3001/api/v1";

export default function ProblemsListPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/problems`);
        if (!res.ok) throw new Error("Failed to fetch problems");
        const data = await res.json();
        console.log("Fetched problems:", data);
        if (active) setProblems(data?.data || data || []);
      } catch (e) {
        console.log(e);
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl font-semibold tracking-tight">All Problems</h1>
        <Button asChild variant="default" size="sm">
          <Link href="/create-problem">Create Problem</Link>
        </Button>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && (
        <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden bg-background">
          {problems?.length === 0 && (
            <li className="p-6 text-sm text-muted-foreground text-center">
              No problems found.
            </li>
          )}
          {problems?.map((p) => (
            <li key={p._id}>
              <Link
                href={`/problems/${p._id}`}
                className={cn(
                  "flex items-start gap-4 p-4 hover:bg-muted/60 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                )}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium leading-none truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {p.description?.replace(/[#*_`>\-]/g, "").slice(0, 160) ||
                      "No description"}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase font-semibold px-2 py-1 rounded shrink-0 self-start",
                    p.difficulty === "easy" &&
                      "bg-emerald-500/15 text-emerald-500",
                    p.difficulty === "medium" &&
                      "bg-amber-500/15 text-amber-500",
                    p.difficulty === "hard" && "bg-rose-500/15 text-rose-500"
                  )}
                >
                  {p.difficulty}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
