"use server";

import QRCode from "qrcode";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";
import { config } from "@/config";
import { put } from "@vercel/blob";
import { getSelectedLocation } from "@/libs/actions";
import { Tables } from "@prisma/client";

export async function getTable(id: number) {
  const table = await prisma.tables.findFirst({
    where: { id },
  });
  if (!table) return redirect("/backoffice/tables");
  return table;
}

export async function updateTable(formData: FormData) {
  const id = formData.get("id");
  const name = formData.get("name") as string;
  await prisma.tables.update({
    data: {
      name,
    },
    where: { id: Number(id) },
  });
  redirect("/backoffice/tables");
}

export async function createTable(formData: FormData) {
  const name = formData.get("name") as string;
  const table = await prisma.tables.create({
    data: {
      name,
      locationId: (await getSelectedLocation())?.locationId as number,
      qrCodeImageUrl: "",
    },
  });

  await prisma.tables.update({
    data: { ...table, qrCodeImageUrl: await createQrCodeImageUrl(table) },
    where: { id: table.id },
  });
  redirect("/backoffice/tables");
}

export async function deleteTable(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.tables.update({
    data: { isArchived: true },
    where: { id },
  });
  redirect("/backoffice/tables");
}

export async function createQrCodeImageUrl(table: Tables) {
  const orderAppUrl = `${config.orderAppUrl}?tableId=${table.id}`;
  const qrCodeImage = await QRCode.toBuffer(orderAppUrl, { scale: 7 });
  const { url } = await put(`foodie-pos/table-${table.id}.png`, qrCodeImage, {
    access: "public",
  });
  return url;
}
