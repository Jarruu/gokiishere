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

  console.log("Admin user seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
