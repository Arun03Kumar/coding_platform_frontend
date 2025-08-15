"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchProblem } from "@/store/problemSlice";
import { initializeSocket, disconnectSocket } from "@/services/socketService";
import ProblemHeader from "@/components/problem/ProblemHeader";
import ProblemDescription from "@/components/problem/ProblemDescription";
import CodeEditor from "@/components/problem/CodeEditor";
import OutputTabs from "@/components/problem/OutputTabs";

export default function ProblemDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    // Fetch problem data
    dispatch(fetchProblem({ id, language: "JAVA" }));

    // Initialize socket connection
    const socket = initializeSocket(dispatch);

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, [id, dispatch]);

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full min-h-screen">
      <ProblemHeader problemId={id} />
      <main className="flex flex-col lg:flex-row flex-1 min-h-0">
        <ProblemDescription />
        <section className="flex-1 min-h-0 flex flex-col">
          <CodeEditor />
          <OutputTabs />
        </section>
      </main>
    </div>
  );
}
