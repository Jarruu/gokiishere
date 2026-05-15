import React from "react";
import { Skeleton } from "../ui/Skeleton";
import { BrutalistCard } from "../ui/BrutalistCard";

export const DashboardItemSkeleton: React.FC = () => {
  return (
    <BrutalistCard
      className="p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-6 w-full">
        <Skeleton className="w-24 h-24 border-2 border-black shrink-0" />
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
          <Skeleton className="w-3/4 h-8 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        {[1, 2, 3].map((j) => (
          <Skeleton key={j} className="w-12 h-12 border-2 border-black" />
        ))}
      </div>
    </BrutalistCard>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>

      {[1, 2, 3, 4].map((i) => (
        <DashboardItemSkeleton key={i} />
      ))}
    </div>
  );
};
