import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("abadinanjaya777", 10);

  await prisma.admin.upsert({
    where: { username: "gokiishere" },
    update: {},
    create: {
      username: "gokiishere",
      password: hashedPassword,
    },
  });

  await prisma.project.upsert({
    where: { id: "seed-project-gokiishere-portfolio" },
    update: {
      title: "Gokiishere Portfolio Platform",
      category: "WEB",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
      description: "A fullstack portfolio dashboard for managing projects, admin authentication, and local asset uploads.",
      fullContent:
        "Platform ini dibuat untuk mengelola portfolio project secara terpusat. Backend menggunakan Hono, Prisma, dan SQLite untuk menyimpan data project serta admin. Frontend menyediakan halaman publik, detail project, dan dashboard admin untuk membuat, mengedit, menghapus, serta menampilkan project.\n\nFitur utama meliputi autentikasi admin berbasis JWT, upload gambar lokal ke folder uploads, dokumentasi API via Swagger, dan data project yang bisa difilter serta dipaginasi.",
      techStack: ["React", "TypeScript", "Hono", "Prisma", "SQLite", "Tailwind CSS"],
      completedIn: "2026",
    },
    create: {
      id: "seed-project-gokiishere-portfolio",
      title: "Gokiishere Portfolio Platform",
      category: "WEB",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
      description: "A fullstack portfolio dashboard for managing projects, admin authentication, and local asset uploads.",
      fullContent:
        "Platform ini dibuat untuk mengelola portfolio project secara terpusat. Backend menggunakan Hono, Prisma, dan SQLite untuk menyimpan data project serta admin. Frontend menyediakan halaman publik, detail project, dan dashboard admin untuk membuat, mengedit, menghapus, serta menampilkan project.\n\nFitur utama meliputi autentikasi admin berbasis JWT, upload gambar lokal ke folder uploads, dokumentasi API via Swagger, dan data project yang bisa difilter serta dipaginasi.",
      techStack: ["React", "TypeScript", "Hono", "Prisma", "SQLite", "Tailwind CSS"],
      completedIn: "2026",
    },
  });

  console.log("Seed completed: admin user and 1 project created/updated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
