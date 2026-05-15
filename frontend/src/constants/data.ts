import React from "react";
import { Globe, Cpu, Boxes, Zap, Workflow, Plus } from "lucide-react";
import { Service, ProcessStep, PortfolioItem, FAQ } from "../types";

export const SERVICES: Service[] = [
  {
    icon: React.createElement(Globe, { className: "w-6 h-6" }),
    title: "Web & App Development",
    desc: "Landing page, Fullstack Web App, & Mobile Apps (Android/iOS).",
    tech: ["React", "Next.js", "Flutter", "Node.js"],
  },
  {
    icon: React.createElement(Cpu, { className: "w-6 h-6" }),
    title: "Machine Learning",
    desc: "Pembuatan model AI, Data analysis, Image Recognition, & NLP.",
    tech: ["Python", "PyTorch", "Pandas", "Scikit"],
  },
  {
    icon: React.createElement(Boxes, { className: "w-6 h-6" }),
    title: "Verilog & FSM",
    desc: "Desain Sirkuit Digital, Finite State Machine, Simulation & Implementasi FPGA.",
    tech: ["Verilog", "Digital Logic"],
  },
  {
    icon: React.createElement(Zap, { className: "w-6 h-6" }),
    title: "Arduino & IoT",
    desc: "Sistem Kendali, Monitoring Sensor, & Automasi berbasis Microcontroller.",
    tech: ["C++", "ESP32", "IoT Protocols"],
  },
  {
    icon: React.createElement(Workflow, { className: "w-6 h-6" }),
    title: "Algorithm & Flowchart",
    desc: "Visualisasi logika, flowchart profesional, dan optimalisasi algoritma.",
    tech: ["Algorithm", "Logic Gates", "Draw.io"],
  },
  {
    icon: React.createElement(Plus, { className: "w-6 h-6" }),
    title: "And Many More",
    desc: "Kami menangani berbagai kebutuhan teknis custom lainnya.",
    tech: ["Custom", "Solutions", "Engineering"],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Consultation",
    desc: "Diskusikan kebutuhan project kamu secara detail via WhatsApp atau Zoom.",
  },
  {
    step: "02",
    title: "Agreement",
    desc: "Kesepakatan harga, timeline, dan pembayaran DP untuk booking slot.",
  },
  {
    step: "03",
    title: "Development",
    desc: "Proses pengerjaan dengan update berkala. kamu bisa memantau progresnya.",
  },
  {
    step: "04",
    title: "Handover",
    desc: "Penyerahan file project, pelunasan, dan sesi penjelasan jika diperlukan.",
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "ecommerce-system",
    title: "E-Commerce System",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
    description:
      "Sistem e-commerce skala besar dengan integrasi payment gateway dan manajemen stok otomatis.",
    fullContent:
      "Project ini melibatkan pembangunan platform e-commerce yang tangguh menggunakan Next.js dan Node.js. Fitur utamanya mencakup sistem autentikasi multifaktor, keranjang belanja real-time, integrasi dengan Midtrans untuk pembayaran, dan dashboard admin yang komprehensif untuk memantau analitik penjualan.",
    techStack: ["React", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "smart-home-iot",
    title: "Smart Home IoT",
    category: "Arduino & IoT",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
    description:
      "Sistem kendali rumah pintar berbasis ESP32 dengan monitoring via aplikasi mobile.",
    fullContent:
      "Solusi IoT menyeluruh untuk otomatisasi rumah. Menggunakan ESP32 sebagai mikrokontroler utama yang terhubung dengan berbagai sensor (suhu, kelembapan, gerakan). Data dikirimkan ke Firebase dan dapat dikontrol secara real-time melalui aplikasi Flutter. Sistem ini juga mendukung perintah suara via Google Assistant.",
    techStack: ["C++", "ESP32", "Flutter", "Firebase", "MQTT"],
  },
  {
    id: "traffic-ai-analysis",
    title: "Traffic AI Analysis",
    category: "Machine Learning",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
    description:
      "Analisis kepadatan lalu lintas menggunakan Computer Vision untuk optimasi lampu merah.",
    fullContent:
      "Implementasi model Machine Learning untuk mendeteksi dan menghitung jumlah kendaraan melalui CCTV secara real-time. Menggunakan algoritma YOLOv8 untuk object detection. Hasil analisis digunakan untuk mengatur durasi lampu lalu lintas secara adaptif guna mengurangi kemacetan secara signifikan.",
    techStack: ["Python", "PyTorch", "OpenCV", "YOLOv8", "FastAPI"],
  },
  {
    id: "riscv-cpu-design",
    title: "RISC-V CPU Design",
    category: "Verilog & FSM",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    description:
      "Desain prosesor RISC-V 32-bit single-cycle menggunakan Verilog HDL.",
    fullContent:
      "Perancangan arsitektur komputer tingkat rendah. Project ini mencakup pembuatan ALU, Register File, Control Unit, dan Memory Interface. Seluruh desain diverifikasi menggunakan testbench di Vivado dan diimplementasikan pada FPGA Artix-7. Fokus utama adalah pada optimasi jalur kritis dan efisiensi penggunaan logic gate.",
    techStack: ["Verilog", "Vivado", "Digital Logic", "FPGA"],
  },
];

export const FAQS: FAQ[] = [
  {
    q: "Apakah privasi project saya terjamin?",
    a: "Mutlak. Kami menjamin kerahasiaan seluruh data dan file project kamu. Kami siap menandatangani NDA jika diperlukan.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Sistem DP (Down Payment) di awal sebesar 50%, dan pelunasan setelah project selesai dikerjakan namun sebelum handover file final.",
  },
  {
    q: "Apakah ada garansi revisi?",
    a: "Ya, kami memberikan revisi gratis terbatas sesuai kesepakatan awal untuk memastikan hasil akhir sesuai dengan requirement.",
  },
  {
    q: "Berapa lama waktu pengerjaannya?",
    a: "Tergantung kompleksitas, namun rata-rata project selesai dalam waktu 48 jam hingga 1 minggu.",
  },
];
