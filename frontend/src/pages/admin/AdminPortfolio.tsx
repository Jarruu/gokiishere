import React, { useEffect, useState, useMemo, useRef, Suspense, use, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Edit, ArrowLeft, Search, Filter, SortAsc, SortDesc, X, ChevronDown, Trash2, Eye } from "lucide-react";
import { BrutalistCard } from "../../components/ui/BrutalistCard";
import { ProjectCardSkeleton } from "../../components/skeletons/ProjectCardSkeleton";
import { PortfolioItem } from "../../types";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth";
import { Dropdown } from "../../components/ui/Dropdown";
import { getProjects, deleteProject, invalidateCache } from "../../lib/api";

const AdminPortfolioContent: React.FC<{
  searchQuery: string;
  sortBy: string;
  filterCategory: string;
  setSortBy: (val: string) => void;
  setFilterCategory: (val: string) => void;
  resetFilters: () => void;
}> = ({ searchQuery, sortBy, filterCategory, setSortBy, setFilterCategory, resetFilters }) => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
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

  const handleDelete = (id: string, title: string) => {
    toast.custom((t) => (
      <div className="bg-brand-yellow border-4 border-black p-6 shadow-[12px_12px_0px_0px_var(--color-brand-red)] w-full max-w-[400px]">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-brand-red border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)] shrink-0">
            <Trash2 size={24} className="text-brand-yellow" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase leading-tight mb-1">HAPUS PROJECT?</h3>
            <p className="font-bold text-xs opacity-60 uppercase leading-relaxed">
              "{title}" akan dihapus permanen dari preview portfolio.
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
                  toast.success(`PROJECT "${title.toUpperCase()}" BERHASIL DIHAPUS`, { id: deleteToastId });
                } catch (error: any) {
                  toast.error(error.message || 'GAGAL MENGHAPUS PROJECT', { id: deleteToastId });
                }
              });
            }}
            className="flex-1 py-3 bg-brand-red text-brand-yellow border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            HAPUS SEKARANG
          </button>
          <button 
            onClick={() => toast.dismiss(t)}
            className="flex-1 py-3 bg-brand-yellow text-black border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            BATAL
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.length === 0 && !isLoading && (
        <div className="col-span-full py-32 border-4 border-dashed border-black/10 text-center">
          <p className="text-2xl font-black uppercase opacity-20">
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
      {projects.map((item, index) => (
        <div key={item.id} className="relative group" ref={index === projects.length - 1 ? lastProjectRef : null}>
          <Link to={`/projects/${item.id}`}>
            <motion.div whileHover={{ y: -5 }} className="cursor-pointer">
              <BrutalistCard className="overflow-hidden group-hover:border-brand-red transition-colors">
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
                  {item.techStack && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.techStack.slice(0, 3).map(t => (
                        <span key={t} className="text-[8px] border border-black/20 px-1 font-bold opacity-60 uppercase">{t}</span>
                      ))}
                      {item.techStack.length > 3 && <span className="text-[8px] font-bold opacity-40">+{item.techStack.length - 3}</span>}
                    </div>
                  )}
                  <div className="mt-4 flex justify-between items-center text-xs font-bold opacity-40 uppercase border-t border-black/5 pt-3">
                    <span className="flex items-center gap-1"><Eye size={12} /> View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </BrutalistCard>
            </motion.div>
          </Link>
          
          {/* Admin Quick Actions */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/projects/edit/${item.id}`);
              }}
              className="p-2 bg-brand-yellow border-2 border-black shadow-[2px_2px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              title="Edit Project"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleDelete(item.id, item.title);
              }}
              disabled={isPending}
              className="p-2 bg-brand-red text-brand-yellow border-2 border-black shadow-[2px_2px_0px_0px_var(--color-brand-red)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50"
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {isLoading && (
        <>
          {[1, 2, 3].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </>
      )}
    </div>
  );
};

const AdminPortfolio: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("A-Z");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // All available categories
  const categories = ["All", "WEB", "APP", "MACHINE_LEARNING", "VERILOG_FSM", "ARDUINO_IOT", "ALGORITHM_FLOWCHART", "OTHERS"];

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("A-Z");
    setFilterCategory("All");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-16 bg-brand-yellow">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-block px-2 py-1 bg-brand-red text-brand-yellow text-[10px] font-black uppercase mb-4 border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)]">
            Admin Preview Mode
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Portfolio <span className="text-brand-red">Preview</span>.
          </h1>
          <p className="text-lg font-bold opacity-60 mt-4 max-w-2xl">
            Tampilan portfolio sebagaimana yang dilihat oleh pengunjung. Gunakan tombol edit untuk melakukan perubahan cepat.
          </p>
        </div>
        <Link to="/admin/dashboard" className="group">
          <button className="flex items-center gap-2 font-black uppercase text-sm border-b-4 border-black group-hover:text-brand-red transition-colors pb-1">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
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

            {(searchQuery || filterCategory !== "All" || sortBy !== "A-Z") && (
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

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      }>
        <AdminPortfolioContent 
          searchQuery={searchQuery}
          sortBy={sortBy}
          filterCategory={filterCategory}
          resetFilters={resetFilters}
        />
      </Suspense>
    </div>
  );
};

export default AdminPortfolio;
