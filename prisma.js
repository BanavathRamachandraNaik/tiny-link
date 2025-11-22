import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // <- ensures Prisma connects to Neon
    },
  },
});

export default prisma;
