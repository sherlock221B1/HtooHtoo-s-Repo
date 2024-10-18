import { getMenu } from "../actions";
import {
  getCompanyAddonCategories,
  getCompanyMenuCategories,
} from "@/libs/actions";
import { UpdateMenuForm } from "./UpdateMenuForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function MenuUpdatePage({ params }: Props) {
  const { id } = params;
  const menu = await getMenu(Number(id));
  const isAvailable = menu.DisabledLocationsMenus.find(
    (item) => item.menuId === Number(id)
  )
    ? false
    : true;
  const menuCategories = await getCompanyMenuCategories();
  const selectedMenuCategoryIds = menu?.menuCategoriesMenus.map(
    (item) => item.menuCategoryId
  );
  const addonCategories = await getCompanyAddonCategories();
  const selectedAddonCategoryIds = menu?.menusAddonCategories.map(
    (item) => item.addonCategoryId
  );

  return (
    <UpdateMenuForm
      menu={menu}
      menuCategories={menuCategories}
      isAvailable={isAvailable}
      selectedMenuCategoryIds={selectedMenuCategoryIds}
      addonCategories={addonCategories}
      selectedAddonCategoryIds={selectedAddonCategoryIds}
    />
  );
}
