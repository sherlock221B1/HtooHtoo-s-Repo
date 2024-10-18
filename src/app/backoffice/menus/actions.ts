"use server";

import { getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  id: z
    .number({ message: "Required field id is missing" })
    .gt(0, { message: "Id cannot be 0" }),
  name: z
    .string()
    .min(5, { message: "Menu name must be at least 5 characters long" }),
  price: z.number({ message: "Price must be a number" }),
  isAvailable: z.boolean(),
  imageUrl: z.string(),
  menuCategoryIds: z
    .array(z.number())
    .min(1, { message: "Required menu category ids is missing" }),
});

const CreateMenuValidate = FormSchema.omit({
  id: true,
  isAvailable: true,
});
const UpdateMenuValidate = FormSchema.omit({
  isAvailable: true,
  imageUrl: true,
  menuCategoryIds: true,
});
const DeleteMenuValidate = FormSchema.pick({ id: true });

export async function getMenu(id: number) {
  const menu = await prisma.menus.findFirst({
    where: { id },
    include: {
      menuCategoriesMenus: true,
      DisabledLocationsMenus: true,
      menusAddonCategories: true,
    },
  });
  if (!menu) return redirect("/backoffice/menus");
  return menu;
}

export async function updateMenu(formData: FormData) {
  try {
    const { id, name, price } = UpdateMenuValidate.parse({
      id: Number(formData.get("id")),
      name: formData.get("name"),
      price: Number(formData.get("price")),
    });
    const isAvailable = formData.get("isAvailable");
    const imageUrl = formData.get("imageUrl") as string;
    const menuCategoryIds = formData
      .getAll("menuCategories")
      .map((item) => Number(item));
    const addonCategoryIds = formData
      .getAll("addonCategories")
      .map((item) => Number(item));
    const menu = await prisma.menus.findFirst({ where: { id } });
    await prisma.menus.update({
      data: {
        name,
        price: Number(price),
        imageUrl: imageUrl ? imageUrl : menu?.imageUrl,
      },
      where: { id: Number(id) },
    });

    // Update menu category
    const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
      where: { menuId: Number(id) },
    });
    const existingMenuCategoryIds = menuCategoriesMenus.map(
      (item) => item.menuCategoryId
    );
    const isSameMenuCategoryIds =
      menuCategoryIds.length === existingMenuCategoryIds.length &&
      menuCategoryIds.every((itemId: number) =>
        existingMenuCategoryIds.includes(itemId)
      );
    if (!isSameMenuCategoryIds) {
      await prisma.menuCategoriesMenus.deleteMany({
        where: { menuId: Number(id) },
      });
      const data = menuCategoryIds.map((menuCategoryId) => ({
        menuId: Number(id),
        menuCategoryId,
      }));
      await prisma.menuCategoriesMenus.createMany({ data });
    }

    // Update addon category
    const menusAddonCategories = await prisma.menusAddonCategories.findMany({
      where: { menuId: Number(id) },
    });
    const existingAddonCategoryIds = menusAddonCategories.map(
      (item) => item.addonCategoryId
    );
    const isSameAddonCategoryIds =
      addonCategoryIds.length === existingAddonCategoryIds.length &&
      addonCategoryIds.every((itemId: number) =>
        existingAddonCategoryIds.includes(itemId)
      );
    if (!isSameAddonCategoryIds) {
      await prisma.menusAddonCategories.deleteMany({
        where: { menuId: Number(id) },
      });
      const data = addonCategoryIds.map((addonCategoryId) => ({
        menuId: Number(id),
        addonCategoryId,
      }));
      await prisma.menusAddonCategories.createMany({ data });
    }

    const selectedLocationId = (await getSelectedLocation())?.locationId;
    if (!isAvailable) {
      await prisma.disabledLocationsMenus.create({
        data: {
          menuId: Number(id),
          locationId: Number(selectedLocationId),
        },
      });
    } else {
      const disabledLocationsMenus =
        await prisma.disabledLocationsMenus.findFirst({
          where: { menuId: Number(id) },
        });
      if (disabledLocationsMenus) {
        await prisma.disabledLocationsMenus.delete({
          where: { id: disabledLocationsMenus?.id },
        });
      }
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { errors: err.errors };
    }
    return {
      errors: [
        { message: "Something went wrong. Please contact our support." },
      ],
    };
  }
  revalidatePath("/backoffice/menus");
}

export async function createMenu(formData: FormData) {
  try {
    const { name, menuCategoryIds, imageUrl, price } = CreateMenuValidate.parse(
      {
        name: formData.get("name"),
        price: Number(formData.get("price")),
        menuCategoryIds: formData
          .getAll("menuCategories")
          .map((item) => Number(item)),
        imageUrl:
          formData.get("imageUrl") ||
          "https://ckwjtvyexiw8zknt.public.blob.vercel-storage.com/defaut-menu-image-KSJqlcmVPYDSc4yw4mlm30MVB577Sw.png",
      }
    );

    const menu = await prisma.menus.create({
      data: { name, price: price, imageUrl },
    });

    const data = menuCategoryIds.map((menuCategoryId) => ({
      menuId: menu.id,
      menuCategoryId,
    }));
    await prisma.menuCategoriesMenus.createMany({ data });

    // Server upload
    /* if (file.size) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const { url } = await put(
        `foodie-pos/menus/${new Date().getTime()}-${file.name}`,
        buffer,
        {
          access: "public",
        }
      );
      await prisma.menus.update({
        data: { ...menu, imageUrl: url },
        where: { id: menu.id },
      });
    } */
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message).join(",");
      return { error: errorMessages };
    }
    return { error: "Something went wrong. Please contact our support." };
  }
}

export async function deleteMenu(formData: FormData) {
  try {
    const { id } = DeleteMenuValidate.parse({ id: Number(formData.get("id")) });
    await prisma.menuCategoriesMenus.deleteMany({ where: { menuId: id } });
    await prisma.menusAddonCategories.deleteMany({
      where: { menuId: Number(id) },
    });
    await prisma.menus.update({
      data: { isArchived: true },
      where: { id },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message).join(",");
      return { error: errorMessages };
    }
    return { error: "Something went wrong. Please contact our support." };
  }

  redirect("/backoffice/menus");
}
