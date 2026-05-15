import React, { Suspense, use } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Cpu } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PortfolioItem } from "../types";
import { getProject } from "../lib/api";
import { cn } from "../lib/utils";

import { ProjectDetailSkeleton } from "../components/skeletons/ProjectDetailSkeleton";
import { Breadcrumb } from "../components/ui/Breadcrumb";

const ProjectDetailView: React.FC<{ id: string }> = ({ id }) => {
  const project = use(getProject(id)) as PortfolioItem;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-black uppercase mb-4">
          Project Not Found
        </h1>
        <Link to="/projects">
          <Button variant="primary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  if (!whatsappNumber) {
    throw new Error("VITE_WHATSAPP_NUMBER is not defined in environment variables.");
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 lg:p-16">
      {/* 1. Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: "Projects", href: "/projects" },
          { label: project.title }
        ]} 
      />

      {/* 2. Project Hero Section */}
      <header className="mb-12 lg:mb-20">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="bg-brand-red text-white text-[10px] font-black uppercase px-3 py-1.5 tracking-[0.2em] border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)]">
            {project.category}
          </span>
          <span className="bg-brand-yellow text-black text-[10px] font-black uppercase px-3 py-1.5 tracking-[0.2em] border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)]">
            RELEASED {project.completedIn}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] tracking-tighter mb-8">
          {project.title.split(' ').map((word, i) => (
            <span key={i} className={cn("inline-block mr-[0.3em]", i === 0 && "text-brand-red")}>
              {word}
            </span>
          ))}
        </h1>

        <div className="max-w-3xl p-6 border-l-4 border-brand-red bg-black/5">
          <p className="text-lg md:text-xl font-bold italic leading-snug uppercase text-black/70">
            "{project.description}"
          </p>
        </div>
      </header>

      {/* 3. Featured Technical Asset (Main Image) */}
      <section className="mb-12 lg:mb-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-4 border-black shadow-[12px_12px_0px_0px_var(--color-brand-red)] overflow-hidden bg-white max-w-5xl w-full"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.01]"
          />
        </motion.div>
      </section>

      {/* 4. Technical Specifications & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Extensive Content */}
        <article className="lg:col-span-8 space-y-10">
          <div className="prose prose-lg max-w-none">
            <div className="font-bold opacity-80 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-sans tracking-normal text-black/90">
              {project.fullContent}
            </div>
          </div>
          
          {/* Decorative Divider */}
          <div className="h-4 w-full bg-brand-red/10 border-2 border-black border-dashed" />
        </article>

        {/* Right Column: Sticky Metadata & CTA */}
        <aside className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
          {/* Technical Stack Card */}
          <div className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_var(--color-brand-red)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
              <Cpu size={180} />
            </div>
            
            <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3 relative z-10 border-b-2 border-white/10 pb-4">
              <Cpu className="text-brand-yellow" size={20} />
              Technical Stack
            </h3>
            
            <div className="flex flex-wrap gap-3 relative z-10">
              {project.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 border-2 border-white/20 bg-white/5 font-mono text-xs font-bold hover:border-brand-yellow hover:text-brand-yellow transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)]"
                >
                  {tech.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Consultation CTA */}
          <div className="p-8 border-4 border-black bg-brand-yellow shadow-[8px_8px_0px_0px_var(--color-brand-red)] flex flex-col gap-6">
            <div>
              <h4 className="font-black uppercase text-xl tracking-tighter mb-2 italic">
                Chat Konsultasi
              </h4>
              <p className="text-[10px] font-black opacity-60 uppercase leading-tight tracking-widest">
                Siap untuk merealisasikan pengembangan teknis sesuai kebutuhan kamu?
              </p>
            </div>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Button variant="black" className="w-full text-lg py-6 group-hover:bg-brand-red group-hover:shadow-none transition-all">
                MULAI PERCAKAPAN
              </Button>
            </a>
          </div>
          
          <div className="p-4 border-2 border-black border-dotted opacity-40 text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.3em]">Dokumen Teknis Resmi Gokiishere</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailView id={id} />
      </Suspense>
    </div>
  );
};

export default ProjectDetail;
