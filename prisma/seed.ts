require("dotenv").config();
import { PrismaClient } from "@prisma/client";
import products from "./products.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with products...");

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log("Cleared existing products");

  for (const product of products as any) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${created.name}`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
