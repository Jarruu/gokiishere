import React, { useState, useEffect, useMemo, useRef, Suspense, use, useTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, ExternalLink, Filter, Search, SortAsc, SortDesc, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { Button } from '../../components/ui/Button';
import { BrutalistCard } from '../../components/ui/BrutalistCard';
import { toast } from 'sonner';
import { useAuth } from '../../lib/auth';
import { Dropdown } from '../../components/ui/Dropdown';
import { getProjects, deleteProject, invalidateCache } from '../../lib/api';
import { DashboardSkeleton, DashboardItemSkeleton } from '../../components/skeletons/DashboardSkeleton';

const CATEGORY_LABELS: Record<string, string> = {
  "All": "All Categories",
  "WEB": "Web Development",
  "APP": "App Development",
  "MACHINE_LEARNING": "Machine Learning",
  "VERILOG_FSM": "Verilog & FSM",
  "ARDUINO_IOT": "Arduino & IoT",
  "ALGORITHM_FLOWCHART": "Algorithm & Flowchart",
  "OTHERS": "Others"
};

const DashboardContent: React.FC<{
  searchQuery: string;
  sortBy: string;
  filterCategory: string;
  setSortBy: (val: string) => void;
  setFilterCategory: (val: string) => void;
  resetFilters: () => void;
}> = ({ searchQuery, sortBy, filterCategory, setSortBy, setFilterCategory, resetFilters }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  // Handle Search Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMore = async (pageNum: number, isReset = false) => {
    if (isLoading && !isReset) return;
    setIsLoading(true);
    try {
      const response = await getProjects(pageNum, 6, debouncedSearch, filterCategory, sortBy);
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
    // Reset and load first page when filters change
    loadMore(1, true);
  }, [debouncedSearch, sortBy, filterCategory]);

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

  const handleDelete = (id: string) => {
    const projectToDelete = projects.find(p => p.id === id);
    if (!projectToDelete) return;

    toast.custom((t) => (
      <div className="bg-brand-yellow border-4 border-black p-6 shadow-[12px_12px_0px_0px_var(--color-brand-red)] w-full max-w-[400px]">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-brand-red border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)] shrink-0">
            <Trash2 size={24} className="text-brand-yellow" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase leading-tight mb-1">HAPUS PROJECT?</h3>
            <p className="font-bold text-xs opacity-60 uppercase leading-relaxed">
              "{projectToDelete.title}" akan dihapus permanen dari technical assets.
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => {
              toast.dismiss(t);
              startTransition(async () => {
                const deleteToastId = toast.loading('MENGHAPUS PROJECT...');
                try {
                  await deleteProject(id);
                  setProjects(prev => prev.filter(p => p.id !== id));
                  toast.success('PROJECT BERHASIL DIHAPUS', { id: deleteToastId });
                } catch (error: any) {
                  toast.error(error.message || 'GAGAL MENGHAPUS PROJECT', { id: deleteToastId });
                }
              });
            }}
            className="flex-1 py-3 bg-brand-red text-brand-yellow border-2 border-black font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            HAPUS SEKARANG
          </button>
          <button 
            onClick={() => toast.dismiss(t)}
            className="flex-1 py-3 bg-brand-yellow text-black border-2 border-black font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            BATAL
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center font-black uppercase text-xs tracking-widest opacity-40">
        <span>{projects.length} Projects Displayed</span>
        <div className="flex items-center gap-2 italic">
          <Filter size={14} /> Sorted by {sortBy}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.length === 0 && !isLoading && (
          <div className="border-4 border-dashed border-black/10 p-20 text-center">
            <p className="font-black uppercase opacity-20 text-2xl">
              {projects.length === 0 
                ? "No projects found. Add your first masterpiece!" 
                : "No matches found for your filters."}
            </p>
            {projects.length > 0 && (
              <button 
                onClick={resetFilters}
                className="mt-4 font-black uppercase text-brand-red border-b-2 border-brand-red hover:opacity-70"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {projects.map((project, index) => (
          <div key={project.id} ref={index === projects.length - 1 ? lastProjectRef : null}>
            <BrutalistCard className="p-6 bg-brand-yellow flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 w-full">
                <div className="w-24 h-24 border-2 border-black overflow-hidden shrink-0">
                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-brand-yellow px-2 border border-black uppercase">{project.category}</span>
                    <span className="text-[10px] font-bold opacity-40 uppercase">Completed: {project.completedIn}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase truncate">{project.title}</h3>
                  <p className="text-sm font-bold opacity-60 truncate max-w-md">{project.description}</p>
                  {project.techStack && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.techStack.map((t: string) => (
                        <span key={t} className="text-[8px] border border-black/20 px-1 font-bold opacity-60 uppercase">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Link to={`/projects/${project.id}`} target="_blank" className="flex-1 md:flex-none">
                  <button className="w-full h-full p-4 border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-brand-red/10 transition-all flex items-center justify-center">
                    <ExternalLink size={18} />
                  </button>
                </Link>
                <button
                  onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                  className="flex-1 md:flex-none p-4 border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-brand-yellow transition-all flex items-center justify-center"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={isPending}
                  className="flex-1 md:flex-none p-4 border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-brand-red hover:text-brand-yellow transition-all flex items-center justify-center disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </BrutalistCard>
          </div>
        ))}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <DashboardItemSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, []);

  // All available categories
  const categories = ["All", "WEB", "APP", "MACHINE_LEARNING", "VERILOG_FSM", "ARDUINO_IOT", "ALGORITHM_FLOWCHART", "OTHERS"];

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("Newest");
    setFilterCategory("All");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-16 bg-brand-yellow">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Admin <span className="text-brand-red">Dashboard</span></h1>
          <p className="font-bold opacity-60 mt-2">Manage your engineering portfolio</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[58px] p-4 pl-12 border-2 border-black font-bold focus:bg-brand-red/5 outline-none transition-colors shadow-[4px_4px_0px_0px_var(--color-brand-red)]"
            />
          </div>

          {/* Custom Dropdown Filters */}
          <div className="flex flex-wrap gap-4">
            <Dropdown 
              label="All Categories"
              value={filterCategory}
              options={categories}
              onChange={setFilterCategory}
              icon={<Filter size={16} />}
              fullWidth={false}
            />

            <Dropdown 
              label="Sort By"
              value={sortBy}
              options={["Newest", "Oldest", "A-Z", "Z-A"]}
              onChange={setSortBy}
              icon={sortBy === "Newest" || sortBy === "Oldest" ? <Filter size={16} /> : (sortBy === "A-Z" ? <SortAsc size={16} /> : <SortDesc size={16} />)}
              fullWidth={false}
            />

            {(searchQuery || filterCategory !== "All" || sortBy !== "Newest") && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-6 h-[58px] border-2 border-black bg-black text-white font-bold uppercase text-xs hover:bg-brand-red transition-all shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <X size={16} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent 
          searchQuery={searchQuery}
          sortBy={sortBy}
          filterCategory={filterCategory}
          resetFilters={resetFilters}
        />
      </Suspense>
    </div>
  );
};

export default Dashboard;
