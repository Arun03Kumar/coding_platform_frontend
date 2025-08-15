"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { setTestCases } from "@/store/createProblemSlice";

const TestCasesPanel = dynamic(() => import("@/components/TestCasesPanel"), {
  ssr: false,
});

export default function TestCasesTab() {
  const dispatch = useDispatch();
  const testCases = useSelector((state) => state.createProblem.testCases);

  // Handle test cases update - compute new state here instead of passing function
  const handleTestCasesChange = (updateFunction) => {
    const newTestCases = updateFunction(testCases);
    dispatch(setTestCases(newTestCases));
  };

  return (
    <div className="w-full">
      <TestCasesPanel
        testCases={testCases}
        setTestCases={handleTestCasesChange}
      />
    </div>
  );
}
