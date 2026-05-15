import React, { Suspense, use, useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BrutalistCard } from "../components/ui/BrutalistCard";
import { PortfolioItem } from "../types";
import { getProjects } from "../lib/api";
import { ProjectCardSkeleton } from "../components/skeletons/ProjectCardSkeleton";
import { Breadcrumb } from "../components/ui/Breadcrumb";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMore = async (pageNum: number, isReset = false) => {
    if (isLoading && !isReset) return;
    setIsLoading(true);
    try {
      const response = await getProjects(pageNum, 6);
      setProjects(prev => isReset ? response.data : [...prev, ...response.data]);
      setHasMore(response.meta.hasNextPage);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMore(1, true);
  }, []);

  const lastProjectRef = (node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore(page + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  if (projects.length === 0 && !isLoading) {
    return (
      <div className="col-span-full py-32 border-4 border-dashed border-black/10 text-center">
        <p className="text-2xl font-black uppercase opacity-20">
          Database is empty. Check back later!
        </p>
      </div>
    );
  }

  return (
    <>
      {projects.map((item, index) => (
        <div key={item.id} ref={index === projects.length - 1 ? lastProjectRef : null}>
          <Link to={`/projects/${item.id}`}>
            <motion.div whileHover={{ y: -5 }} className="cursor-pointer">
              <BrutalistCard className="overflow-hidden group">
                <div className="h-48 bg-brand-yellow border-b-2 border-black overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-brand-yellow text-[10px] font-black uppercase px-2 py-1 tracking-widest">
                      {item.category.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-brand-yellow">
                  <h3 className="text-lg font-black uppercase italic truncate">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex justify-between items-center text-xs font-bold opacity-40 uppercase">
                    <span>Completed: {item.completedIn}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </BrutalistCard>
            </motion.div>
          </Link>
        </div>
      ))}
      {isLoading && (
        <>
          {[1, 2, 3].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </>
      )}
    </>
  );
};

const Projects: React.FC = () => {
  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-16">
      <Breadcrumb items={[{ label: "Projects" }]} />
      <div className="mb-12 md:mb-16">
        <h1 className="text-[12vw] md:text-[80px] lg:text-[100px] font-black uppercase leading-none tracking-tighter">
          All <span className="text-brand-red">Projects</span>.
        </h1>
        <p className="text-lg md:text-xl font-bold opacity-60 mt-4 max-w-2xl">
          Eksplorasi seluruh karya engineering kami. Dari sistem backend yang
          kompleks hingga antarmuka pengguna yang memukau.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Suspense fallback={
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </>
        }>
          <ProjectList />
        </Suspense>
      </div>
    </div>
  );
};

export default Projects;
