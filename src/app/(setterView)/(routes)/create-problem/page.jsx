"use client";
import React from "react";
import { useSelector } from "react-redux";
import CreateProblemHeader from "@/components/create-problem/CreateProblemHeader";
import CreateQuestionButton from "@/components/create-problem/CreateQuestionButton";
import TabContent from "@/components/create-problem/TabContent";
import { useCreateProblemNotifications } from "@/hooks/useCreateProblemNotifications";

export default function CreateProblem() {
  const showEditor = useSelector((state) => state.createProblem.showEditor);

  // Handle success/error notifications
  useCreateProblemNotifications();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {showEditor && <CreateProblemHeader />}

      <main className="flex-1 px-6 py-8">
        {!showEditor ? <CreateQuestionButton /> : <TabContent />}
      </main>
    </div>
  );
}
