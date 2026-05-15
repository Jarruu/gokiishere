import React from "react";
import { ArrowRight } from "lucide-react";
import { PROCESS_STEPS } from "../constants/data";
import { BrutalistCard } from "../components/ui/BrutalistCard";
import { SectionTitle } from "../components/ui/SectionTitle";

export const Process: React.FC = () => {
  return (
    <section
      id="process"
      className="p-6 md:p-12 lg:p-16 border-b-2 border-black bg-white"
    >
      <SectionTitle
        title="How We"
        highlight="Work"
        subtitle="Transparent & Efficient Workflow"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROCESS_STEPS.map((s, i) => (
          <BrutalistCard
            key={i}
            className="p-6 flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-6 h-6 -rotate-45" />
            </div>
            <span className="text-5xl font-black text-brand-red/20">
              {s.step}
            </span>
            <h3 className="text-xl font-black uppercase">{s.title}</h3>
            <p className="text-sm font-bold opacity-70 leading-relaxed">
              {s.desc}
            </p>
          </BrutalistCard>
        ))}
      </div>
    </section>
  );
};
