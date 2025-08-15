"use client";
import React from "react";
import { useSelector } from "react-redux";
import DescriptionTab from "./DescriptionTab";
import MarkdownTab from "./MarkdownTab";
import TestCasesTab from "./TestCasesTab";
import CodeStubTab from "./CodeStubTab";

export default function TabContent() {
  const activeTab = useSelector((state) => state.createProblem.activeTab);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab />;
      case "markdown":
        return <MarkdownTab />;
      case "testcases":
        return <TestCasesTab />;
      case "codestub":
        return <CodeStubTab />;
      default:
        return <DescriptionTab />;
    }
  };

  return <div className="mx-auto max-w-7xl">{renderTabContent()}</div>;
}
