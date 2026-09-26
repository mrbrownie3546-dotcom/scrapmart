import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import BuyForm from "./BuyForm";

export const dynamic = "force-dynamic";

export default async function BuyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({ where: { slug }, include: { category: true } }),
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
  ]);
  if (!product || !product.available) notFound();
  const wa = (settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  return (
    <main className="container">
      <div className="form">
        <h1 style={{ fontSize: 28 }}>Buy: {product.name}</h1>
        <p className="muted">
          {product.category.name}
          {product.price ? ` — ${product.price}${product.unit ? " / " + product.unit : ""}` : ""}
        </p>
        <BuyForm productName={product.name} category={product.category.name} waNumber={wa} />
      </div>
    </main>
  );
}
