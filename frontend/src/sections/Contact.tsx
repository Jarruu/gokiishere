import React from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";

export const Contact: React.FC = () => {
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!instagramUrl || !whatsappNumber) {
    throw new Error("VITE_INSTAGRAM_URL or VITE_WHATSAPP_NUMBER is not defined in environment variables.");
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <section
      id="contact"
      className="p-6 md:p-16 bg-brand-yellow flex flex-col items-center justify-center text-center py-20 md:py-32"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="max-w-4xl"
      >
        <h2 className="text-[12vw] md:text-[100px] lg:text-[120px] font-black leading-[0.8] uppercase tracking-tighter mb-8 md:mb-12">
          Ready to <br /> <span className="text-brand-red">SHIP</span> IT?
        </h2>
        <p className="text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-2xl mx-auto">
          Jangan biarkan tugas menumpuk menghambat progres kamu. Serahkan pada
          ahlinya dan terima hasil yang memuaskan.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="black" className="text-2xl w-full md:w-auto">
              CHAT VIA WHATSAPP
            </Button>
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="secondary"
              className="text-2xl border-black shadow-[8px_8px_0px_0px_var(--color-brand-red)] w-full md:w-auto"
            >
              INSTAGRAM
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
};
