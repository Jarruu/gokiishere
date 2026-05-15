import React from "react";
import { SERVICES } from "../constants/data";

export const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="lg:grid lg:grid-cols-12 flex flex-col bg-white border-b-2 border-black"
    >
      <div className="lg:col-span-4 p-6 md:p-12 lg:p-16 bg-black text-white flex flex-col justify-center">
        <h2 className="text-sm font-mono uppercase font-black tracking-widest mb-4 bg-brand-red inline-block px-2 w-fit">
          Available Specs
        </h2>
        <h3 className="text-3xl md:text-5xl font-black uppercase leading-none">
          Engineering <br />{" "}
          <span className="text-brand-yellow">Capabilities</span>.
        </h3>
        <p className="mt-6 font-bold opacity-60 text-sm md:text-base">
          Kami menangani berbagai kebutuhan tugasmu mulai dari perancangan
          hardware hingga implementasi software skala besar.
        </p>
      </div>

      <div className="lg:col-span-8 p-6 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {SERVICES.map((item, i) => (
            <div
              key={i}
              className="group flex justify-between items-center border-b border-black/10 py-6 hover:bg-brand-yellow/10 px-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs opacity-40">0{i + 1}</span>
                <span className="font-black text-xl md:text-2xl uppercase italic group-hover:text-brand-red transition-colors">
                  {item.title}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {item.tech.slice(0, 2).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono opacity-40 uppercase font-black"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
