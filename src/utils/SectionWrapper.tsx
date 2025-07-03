import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
}

export default function SectionWrapper({ children }: SectionWrapperProps) {
  return (
    <div className="section-wrapper">
      {children}
    </div>
  );
}
