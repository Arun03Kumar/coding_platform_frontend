"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCodeStubForLanguage,
  setCurrentCodeStubLanguage,
} from "@/store/createProblemSlice";

export default function CodeStubDebugger() {
  const dispatch = useDispatch();
  const { codeStubs, currentCodeStubLanguage } = useSelector(
    (state) => state.createProblem
  );
  const [testValue, setTestValue] = useState("");

  const handleUpdate = () => {
    dispatch(
      updateCodeStubForLanguage({
        language: currentCodeStubLanguage,
        codeStub: {
          startSnippet: testValue,
          endSnippet: "end_" + testValue,
          userSnippet: "user_" + testValue,
        },
      })
    );
  };

  const handleLanguageChange = (lang) => {
    dispatch(setCurrentCodeStubLanguage(lang));
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-4">CodeStub Debugger</h3>

      <div className="mb-4">
        <label>Current Language: {currentCodeStubLanguage}</label>
        <div className="flex gap-2 mt-2">
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleLanguageChange("JAVA")}
          >
            Java
          </button>
          <button
            className="px-2 py-1 bg-green-500 text-white rounded"
            onClick={() => handleLanguageChange("PYTHON")}
          >
            Python
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => handleLanguageChange("CPP")}
          >
            C++
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
          placeholder="Enter test value"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleUpdate}
          className="ml-2 px-2 py-1 bg-purple-500 text-white rounded"
        >
          Update {currentCodeStubLanguage}
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-bold">Current State:</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs">
          {JSON.stringify(codeStubs, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-bold">Current Language Data:</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs">
          {JSON.stringify(codeStubs[currentCodeStubLanguage] || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
