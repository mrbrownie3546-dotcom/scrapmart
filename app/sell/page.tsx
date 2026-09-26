import { prisma } from "../../lib/prisma";
import SellForm from "./SellForm";

export const dynamic = "force-dynamic";

export default async function Sell() {
  const s = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  const wa = (s?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  return (
    <main className="container">
      <div className="form">
        <h1 style={{ fontSize: 30 }}>Sell Your Scrap</h1>
        <p className="muted">Apni details bhariye — saari details ke saath seedha WhatsApp par message chala jayega.</p>
        <SellForm waNumber={wa} />
      </div>
    </main>
  );
}
