import React, { Suspense, use } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BrutalistCard } from "../components/ui/BrutalistCard";
import { PortfolioItem } from "../types";
import { getProjects, resolveAssetUrl } from "../lib/api";
import { ProjectCardSkeleton } from "../components/skeletons/ProjectCardSkeleton";

const PortfolioGrid: React.FC = () => {
  const response = use(getProjects(1, 4)) as { data: PortfolioItem[] };
  const projects = response.data; // Already sliced by limit in API call ideally, but we keep slice for safety if needed

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map((item) => (
        <Link key={item.id} to={`/projects/${item.id}`}>
          <motion.div whileHover={{ y: -10 }} className="cursor-pointer">
            <BrutalistCard className="overflow-hidden group">
              <div className="h-64 bg-brand-yellow border-b-2 border-black overflow-hidden relative">
                <img
                  src={resolveAssetUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black text-brand-yellow text-[10px] font-black uppercase px-2 py-1 tracking-widest">
                    {item.category.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
              <div className="p-6 flex justify-between items-center bg-brand-yellow">
                <h3 className="text-2xl font-black uppercase italic truncate pr-4">
                  {item.title}
                </h3>
                <div className="p-2 border-2 border-black bg-brand-yellow shadow-[2px_2px_0px_0px_var(--color-black)] group-hover:shadow-[4px_4px_0px_0px_var(--color-black)] transition-all shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </BrutalistCard>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export const Portfolio: React.FC = () => {
  return (
    <section
      id="portfolio"
      className="p-6 md:p-12 lg:p-16 border-b-2 border-black"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Our <span className="text-brand-yellow bg-black px-2">Work</span>.
          </h2>
          <p className="font-mono text-sm uppercase opacity-60 mt-2">
            Selected engineering excellence
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Link to="/projects" className="block w-full md:inline-block">
            <button className="brutalist-button bg-brand-red text-brand-yellow shadow-[4px_4px_0px_0px_var(--color-black)] hover:shadow-[6px_6px_0px_0px_var(--color-black)] hover:-translate-x-0.5 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-3 w-full md:w-auto transition-all">
              All Projects <ChevronsRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      }>
        <PortfolioGrid />
      </Suspense>
    </section>
  );
};
