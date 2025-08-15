"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { setCodeStub } from "@/store/createProblemSlice";

const CodeStubPanel = dynamic(() => import("@/components/CodeStubPanel"), {
  ssr: false,
});

export default function CodeStubTab() {
  const dispatch = useDispatch();
  const codeStub = useSelector((state) => state.createProblem.codeStub);

  // Handle code stub update - compute new state here instead of passing function
  const handleCodeStubChange = (updateFunction) => {
    if (typeof updateFunction === "function") {
      const newCodeStub = updateFunction(codeStub);
      dispatch(setCodeStub(newCodeStub));
    } else {
      // If it's already a value, use it directly
      dispatch(setCodeStub(updateFunction));
    }
  };

  return (
    <div className="w-full">
      <CodeStubPanel codeStub={codeStub} setCodeStub={handleCodeStubChange} />
    </div>
  );
}
