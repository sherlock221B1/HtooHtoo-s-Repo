"use server";

import { getCompanyId, getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function updateMenuCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const id = formData.get("id");
  const isAvailable = formData.get("isAvailable");
  await prisma.menuCategories.update({
    data: { name: name },
    where: { id: Number(id) },
  });
  const selectedLocationId = (await getSelectedLocation())?.locationId;
  if (!isAvailable) {
    await prisma.disabledLocationsMenuCategories.create({
      data: {
        menuCategoryId: Number(id),
        locationId: Number(selectedLocationId),
      },
    });
  } else {
    const disabledLocationsMenuCategories =
      await prisma.disabledLocationsMenuCategories.findFirst({
        where: { menuCategoryId: Number(id) },
      });
    if (disabledLocationsMenuCategories) {
      await prisma.disabledLocationsMenuCategories.delete({
        where: { id: disabledLocationsMenuCategories?.id },
      });
    }
  }
  redirect("/backoffice/menu-categories");
}

export async function createNewMenuCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    await prisma.menuCategories.create({
      data: { name, companyId: (await getCompanyId()) as number },
    });
  } catch (err) {
    console.log(err);
    return;
  }
  redirect("/backoffice/menu-categories");
}

export async function deleteMenuCategory(formData: FormData) {
  const id = formData.get("id");
  await prisma.menuCategories.update({
    data: { isArchived: true },
    where: { id: Number(id) },
  });
  redirect("/backoffice/menu-categories");
}
