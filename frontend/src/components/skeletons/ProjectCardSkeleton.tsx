import React from "react";
import { BrutalistCard } from "../ui/BrutalistCard";
import { Skeleton } from "../ui/Skeleton";

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <BrutalistCard className="overflow-hidden">
      <div className="h-48 md:h-64 bg-brand-yellow border-b-2 border-black relative">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="w-20 h-6" />
        </div>
      </div>
      <div className="p-4 md:p-6 bg-brand-yellow">
        <Skeleton className="w-3/4 h-8 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-6 h-6" />
        </div>
      </div>
    </BrutalistCard>
  );
};
