"use server";

import { prisma } from "@/libs/prisma";
import { ORDERSTATUS } from "@prisma/client";

export async function getTotalPriceByOrderId(orderId: number) {
  const order = await prisma.orders.findFirst({
    where: { id: orderId },
    include: { OrdersAddons: true, menu: true },
  });

  if (!order) return 0;

  const addonIds = order.OrdersAddons.map((item) => item.addonId);
  const addons = await prisma.addons.findMany({
    where: { id: { in: addonIds } },
  });

  let totalPrice = order?.menu.price || 0;
  if (addons.length) {
    for (const addon of addons) {
      totalPrice += addon.price;
    }
  }
  return totalPrice * order.quantity;
}

export async function updateOrderStatus(orderId: number, status: ORDERSTATUS) {
  await prisma.orders.update({ data: { status }, where: { id: orderId } });
}
