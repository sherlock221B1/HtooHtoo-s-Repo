"use server";

import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function updateAddonCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const isRequired = formData.get("isRequired");
  const id = formData.get("id");
  await prisma.addonCategories.update({
    data: { name, isRequired: Boolean(isRequired) },
    where: { id: Number(id) },
  });
  redirect("/backoffice/addon-categories");
}

export async function createNewAddonCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const isRequired = formData.get("isRequired");
  const menuIds = formData.getAll("menus").map((item) => Number(item));
  const addonCategory = await prisma.addonCategories.create({
    data: { name, isRequired: Boolean(isRequired) },
  });
  const data = menuIds.map((menuId) => ({
    menuId,
    addonCategoryId: addonCategory.id,
  }));
  await prisma.menusAddonCategories.createMany({ data });
  redirect("/backoffice/addon-categories");
}

export async function deleteAddonCategory(formData: FormData) {
  const id = formData.get("id");
  await prisma.menusAddonCategories.deleteMany({
    where: { addonCategoryId: Number(id) },
  });
  await prisma.addonCategories.update({
    data: { isArchived: true },
    where: { id: Number(id) },
  });
  redirect("/backoffice/addon-categories");
}
