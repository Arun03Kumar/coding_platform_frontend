"use client";

import {
  ChevronLeft,
  Menu as MenuIcon,
  Book,
  ListTodo,
  Settings,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: <Book className="h-5 w-5 mr-2" />, title: "All Problems" },
  { icon: <ListTodo className="h-5 w-5 mr-2" />, title: "My Sets" },
  { icon: <Settings className="h-5 w-5 mr-2" />, title: "Settings" },
];

const SideBar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    // eslint-disable-next-line
  }, [isMobile]);

  const handleResizeStart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (event) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240; // Minimum width
    if (newWidth > 480) newWidth = 480; // Maximum width

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
    }
    sidebarRef.current.style.width = isMobile ? "100%" : "240px";
    navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
    navbarRef.current.style.setProperty(
      "width",
      isMobile ? "0" : "calc(100% - 240px)"
    );
    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  };

  const handleResizeEnd = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-screen bg-secondary overflow-y-auto relative flex w-60 flex-col z-[100]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div className="flex flex-col gap-1 mt-6">
          {sidebarItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center px-4 py-2 rounded-md hover:bg-primary/10 transition text-left text-sm font-medium text-foreground"
            >
              {item.icon}
              {item.title}
            </button>
          ))}
        </div>
        <div
          role="button"
          onClick={collapse}
          className="absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover-bg-neutral-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </div>
        <div
          onMouseDown={handleResizeStart}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize w-1 bg-primary/10 absolute right-0 top-0 duration-300 h-full"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[105] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-full left-0"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
};

export default SideBar;
