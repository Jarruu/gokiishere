import React from "react";

export interface Service {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tech: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  fullContent?: string;
  techStack?: string[];
  completedIn: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  q: string;
  a: string;
}
