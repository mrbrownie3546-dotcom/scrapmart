"use server";

import { prisma } from "../../lib/prisma";

// Saves a BUY/SELL enquiry in the database so the admin can see history.
// WhatsApp opening happens client-side instantly; this runs in the background.
export async function createOrder(data: {
  type: "BUY" | "SELL";
  name: string;
  phone: string;
  item: string;
  quantity?: string;
  message?: string;
}) {
  const name = data.name?.trim();
  const phone = data.phone?.trim();
  if (!name || !phone) return;
  await prisma.order.create({
    data: {
      type: data.type,
      name,
      phone,
      item: data.item?.trim() || "-",
      quantity: data.quantity?.trim() || null,
      message: data.message?.trim() || null,
    },
  });
}
