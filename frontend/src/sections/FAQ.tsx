import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../constants/data";
import { SectionTitle } from "../components/ui/SectionTitle";

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="p-6 md:p-12 lg:p-16 bg-white border-b-2 border-black">
      <div className="max-w-3xl mx-auto text-center">
        <SectionTitle
          title="FAQ"
          subtitle="Frequently Asked Questions"
          className="text-center"
        />

        <div className="space-y-4 text-left mt-8 md:mt-12">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border-2 border-black overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-4 md:p-6 flex justify-between items-center bg-white hover:bg-brand-yellow/5 transition-colors text-left"
              >
                <h3 className="text-lg md:text-xl font-black uppercase flex items-center gap-3 md:gap-4">
                  <span className="text-brand-red font-mono text-sm md:text-base">
                    0{i + 1}
                  </span>
                  {faq.q}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-4 md:p-6 pt-0 border-t-2 border-black/5">
                      <p className="font-bold opacity-70 leading-relaxed text-base md:text-lg italic">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
