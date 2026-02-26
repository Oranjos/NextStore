require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const products = require("./products.json");

console.log("DATABASE_URL env:", process.env.DATABASE_URL ? "set" : "not set");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with products...");

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log("Cleared existing products");

  for (const product of products) {
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
