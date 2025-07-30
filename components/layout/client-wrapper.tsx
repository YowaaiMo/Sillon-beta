"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoModeBadge } from "@/components/demo-mode-badge";
import type React from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <DemoModeBadge />
    </ThemeProvider>
  );
} 