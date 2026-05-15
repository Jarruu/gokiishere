import React from "react";
import { Skeleton } from "../ui/Skeleton";

export const ProjectDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <div className="max-w-7xl mx-auto p-6 md:p-12 lg:p-16">
        <Skeleton className="w-32 h-6 mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image & Tech */}
          <div className="lg:col-span-7 space-y-8">
            <Skeleton className="aspect-video w-full border-4 border-black shadow-[12px_12px_0px_0px_var(--color-brand-red)]" />

            <div className="bg-black p-8 border-4 border-black shadow-[8px_8px_0px_0px_var(--color-brand-red)]">
              <Skeleton className="w-48 h-8 mb-6 bg-white/20" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-24 h-10 bg-white/10" />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-28 h-6" />
              </div>
              <Skeleton className="w-full h-16 md:h-24 mb-6" />
              <Skeleton className="w-full h-20 mb-8 border-l-4 border-brand-red" />
              <div className="space-y-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <Skeleton className="w-48 h-4 opacity-40" />
              <Skeleton className="w-full h-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
