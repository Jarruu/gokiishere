import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Button } from "../components/ui/Button";
import { getProjects } from "../lib/api";
import { cn } from "../lib/utils";

// Carousel Images
import appDev from "../assets/app-development.webp";
import arduino from "../assets/arduino-code.webp";
import database from "../assets/database.webp";
import flowchart from "../assets/flowchart.webp";
import modelsim from "../assets/wave-on-modelsim.webp";
import webDev from "../assets/web-development.webp";

const COLUMN_1 = [
  { type: "image", src: arduino },
  { type: "image", src: flowchart },
  { type: "image", src: appDev },
  { type: "image", src: database },
  { type: "image", src: webDev },
  { type: "image", src: modelsim },
];

const COLUMN_2 = [
  { type: "image", src: appDev },
  { type: "image", src: webDev },
  { type: "image", src: modelsim },
  { type: "image", src: arduino },
  { type: "image", src: flowchart },
  { type: "image", src: database },
];

const WORDS = ["numpuk", "banyak", "berantakan"];

const AnimatedWord = ({ word }: { word: string }) => {
  return (
    <span className="inline-flex overflow-hidden">
      {word.split("").map((char, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            ease: [0.33, 1, 0.68, 1],
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const ScrollingColumn = ({ items, direction = "up" }: { items: any[], direction?: "up" | "down" }) => {
  const displayItems = [...items, ...items, ...items, ...items];
  
  return (
    <div className="relative h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        animate={{
          y: direction === "up" ? [0, -items.length * 200] : [-items.length * 200, 0],
        }}
        transition={{
          duration: items.length * 5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-6 py-4"
      >
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="w-full border-2 border-black shadow-[6px_6px_0px_0px_var(--color-black)] overflow-hidden shrink-0 group relative bg-white"
          >
            <img 
              src={item.src} 
              alt="Portfolio" 
              className="w-full h-auto block transition-all duration-700 ease-out" 
            />
            <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Force Vite HMR Cache Invalidation
export const Hero: React.FC = () => {
  const [projectCount, setProjectCount] = useState<number>(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    getProjects(1, 1).then(response => {
      setProjectCount(response.meta?.total || response.data?.length || 0);
    }).catch(err => {
      console.error("Error fetching project count:", err);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="lg:min-h-[calc(100vh-98px)] py-8 md:py-10 p-6 md:p-10 lg:p-12 flex flex-col justify-center border-b-2 border-black relative overflow-hidden bg-white">
      {/* Background Text */}
      <div className="absolute top-1/2 left-[-2%] -translate-y-1/2 text-[300px] font-black opacity-[0.02] select-none pointer-events-none hidden lg:block leading-none">
        GOKI
      </div>

      <div className="max-w-7xl mx-auto w-full lg:grid lg:grid-cols-12 lg:gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-4 lg:space-y-6">
          <div className="space-y-2 lg:space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 border border-black font-mono text-[10px] uppercase font-black bg-brand-yellow">
                Established 2026
              </span>
              <span className="text-[10px] font-mono uppercase opacity-60">
                Ringankan beban tugasmu
              </span>
            </div>
            
            <div className="h-auto flex flex-col justify-center">
              <h1 className="text-[12vw] md:text-[60px] lg:text-[65px] xl:text-[75px] leading-[0.8] font-black tracking-tighter uppercase">
                Tugas
                <br />
                <div className="relative inline-flex items-center text-brand-red">
                  <AnimatePresence mode="wait">
                    <AnimatedWord key={WORDS[wordIndex]} word={WORDS[wordIndex]} />
                  </AnimatePresence>
                  <span>?</span>
                </div>
                <br />
                Tenang,
                <br />
                ada <span className="text-brand-red">GOKI !!</span>
              </h1>
            </div>

            <p className="max-w-xl text-base md:text-lg lg:text-lg font-bold leading-tight opacity-80">
              Dari yang simpel sampe yang bikin pusing, semua beres di tangan
              yang tepat 😎.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 lg:pt-2">
              <a href="#contact" className="w-full sm:w-auto">
                <Button variant="primary" className="text-sm lg:text-base w-full py-4 lg:py-5">
                  Direct WhatsApp Order
                </Button>
              </a>
              <a href="#portfolio" className="w-full sm:w-auto">
                <Button variant="secondary" className="text-sm lg:text-base w-full py-4 lg:py-5">
                  View Portfolio
                </Button>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
            <div className="bg-brand-red text-white p-4 flex-1 flex flex-col justify-between border-2 border-black shadow-[4px_4px_0px_0px_var(--color-black)]">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                Tugas Kelar
              </span>
              <span className="text-xl font-black">ALHAMDULILLAH</span>
            </div>
            <div className="bg-white p-4 flex-1 flex flex-col justify-between border-2 border-black shadow-[4px_4px_0px_0px_var(--color-black)]">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 text-brand-red">
                Projects Covered
              </span>
              <span className="text-xl font-black">{projectCount}+ PROJECTS</span>
            </div>
          </div>
        </div>

        {/* Professional Carousel Container - Visible on all views */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4 lg:gap-6 h-[280px] md:h-[380px] lg:h-[400px] xl:h-[480px] relative mt-12 lg:mt-0">
          {/* Inner Yellow Glow Effect - Minimal */}
          <div className="absolute inset-0 z-30 pointer-events-none rounded-sm border-[4px] border-transparent shadow-[inset_0_0_15px_rgba(255,190,11,0.08)]" />
          
          <div className="relative bg-black/[0.005] rounded-sm overflow-hidden border-x border-black/5">
            <ScrollingColumn items={COLUMN_1} direction="up" />
          </div>
          <div className="relative bg-black/[0.005] rounded-sm overflow-hidden border-x border-black/5">
            <ScrollingColumn items={COLUMN_2} direction="down" />
          </div>
        </div>
      </div>
    </section>
  );
};
