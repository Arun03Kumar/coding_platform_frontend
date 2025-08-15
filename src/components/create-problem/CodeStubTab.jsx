"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import {
  setCurrentCodeStubLanguage,
  updateCodeStubForLanguage,
} from "@/store/createProblemSlice";

const EnhancedCodeStubPanel = dynamic(
  () => import("@/components/EnhancedCodeStubPanel"),
  {
    ssr: false,
  }
);

export default function CodeStubTab() {
  const dispatch = useDispatch();
  const { codeStubs, currentCodeStubLanguage } = useSelector(
    (state) => state.createProblem
  );

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    dispatch(setCurrentCodeStubLanguage(newLanguage));
  };

  // Handle code stub update for current language
  const handleCodeStubUpdate = (language, codeStub) => {
    dispatch(updateCodeStubForLanguage({ language, codeStub }));
  };

  return (
    <div className="w-full">
      <EnhancedCodeStubPanel
        codeStubs={codeStubs}
        currentLanguage={currentCodeStubLanguage}
        onLanguageChange={handleLanguageChange}
        onCodeStubUpdate={handleCodeStubUpdate}
      />
    </div>
  );
}
