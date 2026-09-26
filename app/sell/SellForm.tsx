"use client";

import { useState, useTransition } from "react";
import { createOrder } from "../leads/actions";

export default function SellForm({ waNumber }: { waNumber: string }) {
  const [sent, setSent] = useState(false);
  const [, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const item = String(fd.get("item") || "").trim();
    const quantity = String(fd.get("quantity") || "").trim();
    const price = String(fd.get("price") || "").trim();
    const message = String(fd.get("message") || "").trim();

    // Save in background for admin history
    startTransition(() => createOrder({ type: "SELL", name, phone, item, quantity, message: [price && `Expected price: ${price}`, message].filter(Boolean).join("\n") || undefined }));

    const lines = [
      "Hello ScrapMart! New SELL request:",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Scrap type: ${item}`,
      `Approx quantity: ${quantity}`,
      price ? `Expected price: ${price}` : "",
      message ? `Details: ${message}` : "",
    ].filter(Boolean);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit}>
      <label>Aapka Naam *</label>
      <input className="input" name="name" required placeholder="Full name" />
      <label>Phone Number *</label>
      <input className="input" name="phone" required inputMode="tel" placeholder="10-digit mobile" />
      <label>Kya bechna hai? (Scrap type) *</label>
      <input className="input" name="item" required placeholder="e.g. Purana iron, AC, copper wire" />
      <label>Approx Quantity *</label>
      <input className="input" name="quantity" required placeholder="e.g. 100 kg / 1 old AC" />
      <label>Expected Price (optional)</label>
      <input className="input" name="price" placeholder="e.g. ₹40/kg" />
      <label>Location / Details (optional)</label>
      <textarea name="message" rows={2} placeholder="Address, pickup timing..."></textarea>
      <button className="btn green" type="submit">Send Details on WhatsApp</button>
      {sent && <p className="muted" style={{ marginTop: 10 }}>✅ WhatsApp khul gaya — wahan message bhej dijiye. Aapki request admin ko save bhi ho gayi.</p>}
    </form>
  );
}
