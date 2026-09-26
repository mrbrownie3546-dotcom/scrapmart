import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const categories = ["Iron Scrap", "Copper Scrap", "Aluminium Scrap", "Steel Scrap", "Brass Scrap", "E-Waste"];
const samples: Record<string, { description: string; price: string; unit: string }> = {
  "Iron Scrap": { description: "Old iron rods, girders, machines — bulk quantity available.", price: "₹35", unit: "kg" },
  "Copper Scrap": { description: "Pure copper wire and utensils scrap, high quality.", price: "₹720", unit: "kg" },
  "Aluminium Scrap": { description: "Aluminium utensils, window frames and sheets.", price: "₹145", unit: "kg" },
};

async function main() {
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await p.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }
  await p.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999",
      siteName: "ScrapMart",
    },
  });
  // Sample products (only if none exist)
  const count = await p.product.count();
  if (count === 0) {
    for (const [name, data] of Object.entries(samples)) {
      const cat = await p.category.findUnique({ where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } });
      if (!cat) continue;
      await p.product.create({
        data: {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-sample",
          categoryId: cat.id,
          description: data.description,
          price: data.price,
          unit: data.unit,
        },
      });
    }
  }
}

main().finally(() => p.$disconnect());
