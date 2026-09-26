"use client";

import { useState, useTransition } from "react";
import { createOrder } from "../../leads/actions";

export default function BuyForm({ productName, category, waNumber }: { productName: string; category: string; waNumber: string }) {
  const [sent, setSent] = useState(false);
  const [, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const quantity = String(fd.get("quantity") || "").trim();
    const message = String(fd.get("message") || "").trim();

    // Save in background for admin history
    startTransition(() => createOrder({ type: "BUY", name, phone, item: productName, quantity, message }));

    // Open WhatsApp instantly with full details
    const lines = [
      "Hello ScrapMart! New BUY request:",
      `Item: ${productName} (${category})`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      quantity ? `Quantity: ${quantity}` : "",
      message ? `Message: ${message}` : "",
    ].filter(Boolean);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit}>
      <label>Your Name *</label>
      <input className="input" name="name" required placeholder="Full name" />
      <label>Your Phone Number *</label>
      <input className="input" name="phone" required inputMode="tel" placeholder="10-digit mobile" />
      <label>Kitna lena hai? (Quantity) *</label>
      <input className="input" name="quantity" required placeholder="e.g. 50 kg / 2 pieces" />
      <label>Message (optional)</label>
      <textarea name="message" rows={2} placeholder="Location, timing, any question..."></textarea>
      <button className="btn green" type="submit">Send on WhatsApp</button>
      {sent && <p className="muted" style={{ marginTop: 10 }}>✅ WhatsApp khul gaya — wahan message bhej dijiye. Aapki enquiry admin ko save bhi ho gayi.</p>}
    </form>
  );
}
