"use server";

import { getServerSession, User } from "next-auth";
import { prisma } from "./prisma";
import { createQrCodeImageUrl } from "@/app/backoffice/tables/actions";
import { Locations } from "@prisma/client";

export async function getUser(email: string) {
  return await prisma.users.findFirst({ where: { email } });
}

export async function createDefaultData(nextUser: User) {
  const { name, email } = nextUser;
  const company = await prisma.company.create({
    data: { name: "Default company" },
  });
  const user = await prisma.users.create({
    data: { name: String(name), email: String(email), companyId: company.id },
  });
  const menuCategory = await prisma.menuCategories.create({
    data: { name: "Default Menu Category", companyId: company.id },
  });
  const menu = await prisma.menus.create({
    data: { name: "Default menu" },
  });
  await prisma.menuCategoriesMenus.create({
    data: { menuId: menu.id, menuCategoryId: menuCategory.id },
  });
  const addonCategory = await prisma.addonCategories.create({
    data: { name: "Default Addon Category" },
  });
  await prisma.menusAddonCategories.create({
    data: { menuId: menu.id, addonCategoryId: addonCategory.id },
  });
  const addonNames = ["Default Addon 1", "Default Addon 2", "Default Addon 3"];
  const data = addonNames.map((addonName) => ({
    name: addonName,
    addonCategoryId: addonCategory.id,
    price: 0,
  }));
  await prisma.addons.createMany({ data });
  const location = await prisma.locations.create({
    data: { name: "Default location", companyId: company.id },
  });
  const table = await prisma.tables.create({
    data: {
      name: "Default table",
      locationId: location.id,
      qrCodeImageUrl: "",
    },
  });
  const qrCodeImageUrl = await createQrCodeImageUrl(table);
  await prisma.tables.update({
    data: { ...table, qrCodeImageUrl },
    where: { id: table.id },
  });
  await prisma.selectedLocations.create({
    data: { userId: user.id, locationId: location.id },
  });
}

export async function getCompanyId() {
  const session = await getServerSession();
  const dbUser = await prisma.users.findFirst({
    where: { email: session?.user?.email || "" },
  });
  const company = await prisma.company.findFirst({
    where: { id: dbUser?.companyId },
  });
  return company?.id;
}

export async function getDbUserId() {
  const session = await getServerSession();
  const dbUser = await prisma.users.findFirst({
    where: { email: session?.user?.email || "" },
  });
  return dbUser?.id;
}

export async function getCompanyMenuCategories() {
  const companyId = await getCompanyId();
  return await prisma.menuCategories.findMany({
    where: { companyId, isArchived: false },
    include: { DisabledLocationMenuCategories: true },
  });
}

export async function getCompanyMenus() {
  const menuCategories = await getCompanyMenuCategories();
  const menuCategoryIds = menuCategories.map((menuCategory) => menuCategory.id);
  const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menuCategoryIds } },
  });
  const menuIds = menuCategoriesMenus.map((item) => item.menuId);
  return await prisma.menus.findMany({
    where: { id: { in: menuIds } },
    include: { DisabledLocationsMenus: true },
  });
}

export async function getCompanyAddonCategories() {
  const menus = await getCompanyMenus();
  const menuIds = menus.map((menu) => menu.id);
  const menusAddonCategories = await prisma.menusAddonCategories.findMany({
    where: { menuId: { in: menuIds } },
  });
  const addonCategoryIds = menusAddonCategories.map(
    (item) => item.addonCategoryId
  );
  return await prisma.addonCategories.findMany({
    where: { id: { in: addonCategoryIds } },
  });
}

export async function getCompanyAddons() {
  const addonCategories = await getCompanyAddonCategories();
  const addonCategoryIds = addonCategories.map((item) => item.id);
  return await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds } },
  });
}

export async function getCompanyLocations() {
  const companyId = await getCompanyId();

  /* return await prisma.locations.findMany({
    orderBy: { id: "asc" },
    where: { companyId: await getCompanyId() },
  }); */
  const locations: Locations[] =
    await prisma.$queryRaw`select * from "Locations" where "companyId" = ${companyId}`;
  return locations;
}

export async function getSelectedLocation() {
  return await prisma.selectedLocations.findFirst({
    where: { userId: await getDbUserId() },
    include: { location: true },
  });
}

export async function getSelectedLocationTables() {
  const selectedLocationId = (await getSelectedLocation())?.locationId;
  return prisma.tables.findMany({ where: { locationId: selectedLocationId } });
}

export async function getCompanyByTableId(tableId: number) {
  const table = await prisma.tables.findFirst({
    where: { id: Number(tableId) },
  });
  if (!table?.locationId) return null;
  const location = await prisma.locations.findFirst({
    where: { id: table?.locationId },
  });
  return await prisma.company.findFirst({ where: { id: location?.companyId } });
}

export async function getMenuCategoriesByTableId(tableId: string) {
  const company = await getCompanyByTableId(Number(tableId));
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: company?.id, isArchived: false },
    include: {
      menuCategoriesMenus: true,
    },
  });
  const table = await prisma.tables.findFirst({
    where: { id: Number(tableId) },
  });
  const location = await prisma.locations.findFirst({
    where: { id: table?.locationId },
  });
  const disabledLocationsMenuCategories =
    await prisma.disabledLocationsMenuCategories.findMany({
      where: { locationId: location?.id },
    });
  const disabledMenuCategoryIds = disabledLocationsMenuCategories.map(
    (item) => item.menuCategoryId
  );
  return menuCategories.filter(
    (item) => !disabledMenuCategoryIds.includes(item.id)
  );
}

export async function getMenusByMenuCategoryIds(menuCategoryIds: number[]) {
  const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menuCategoryIds } },
  });
  const menuIds = menuCategoriesMenus.map((item) => item.menuId);
  const menus = await prisma.menus.findMany({
    where: { id: { in: menuIds }, isArchived: false },
  });
  const disabledLocationsMenus = await prisma.disabledLocationsMenus.findMany({
    where: { menuId: { in: menuIds } },
  });
  const disabledMenuIds = disabledLocationsMenus.map((item) => item.menuId);
  return menus.filter((menu) => !disabledMenuIds.includes(menu.id));
}
