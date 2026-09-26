import React from "react";
import type { LucideIcon } from "lucide-react";

export interface Project {
  slug: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  tech: string[];
  year: string;
  annotation: string;
  href: string;
  image: string;
  icon: LucideIcon;
  stat: { label: string; value: string };
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface FieldErrors {
  fullName?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  agreement?: string;
}

export interface Metric {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  subtext: string;
}

export interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isDragging?: boolean;
}
