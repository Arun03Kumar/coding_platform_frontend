"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ThemeToggle from "@/components/ThemeToggle";
import { setLanguage } from "@/store/problemSlice";
import { runCode, submitCode } from "@/store/runOutputSlice";

export default function ProblemHeader({ problemId }) {
  const dispatch = useDispatch();
  const problem = useSelector((state) => state.problem.data);
  const language = useSelector((state) => state.problem.language);
  const userCode = useSelector((state) => state.problem.userCode);
  const isRunning = useSelector((state) => state.runOutput.isRunning);
  const isSubmitting = useSelector((state) => state.runOutput.isSubmitting);

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
  };

  const handleRun = () => {
    dispatch(runCode({ id: problemId, userCode, language }));
  };

  const handleSubmit = () => {
    dispatch(submitCode({ id: problemId, userCode, language }));
  };

  return (
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
        <Select value={language} onValueChange={handleLanguageChange}>
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
  );
}
