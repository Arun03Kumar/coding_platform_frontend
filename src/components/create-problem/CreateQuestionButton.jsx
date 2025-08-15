"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { setShowEditor } from "@/store/createProblemSlice";

export default function CreateQuestionButton() {
  const dispatch = useDispatch();

  const handleCreateQuestion = () => {
    dispatch(setShowEditor(true));
  };

  return (
    <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
      <Button
        variant="default"
        size="lg"
        onClick={handleCreateQuestion}
        className="flex items-center gap-2"
      >
        <PlusCircle className="h-5 w-5" />
        Create a Question
      </Button>
    </div>
  );
}
