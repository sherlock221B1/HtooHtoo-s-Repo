import { MenuCategoriesTabs } from "@/components/MenuCategoriesTabs";
import { OrderAppHeader } from "@/components/OrderAppHeader";
import {
  getCompanyByTableId,
  getMenuCategoriesByTableId,
  getMenusByMenuCategoryIds,
} from "@/libs/actions";
import { Box } from "@mui/material";
import { Prisma } from "@prisma/client";

interface Props {
  searchParams: {
    tableId: string;
  };
}

export type MenuCategoriesType = Prisma.MenuCategoriesGetPayload<{
  include: { menuCategoriesMenus: true };
}>;

export default async function OrderApp({ searchParams }: Props) {
  const tableId = Number(searchParams.tableId);
  const company = await getCompanyByTableId(tableId);
  const menuCategories: MenuCategoriesType[] = await getMenuCategoriesByTableId(
    searchParams.tableId
  );
  const menuCategoryIds = menuCategories.map((item) => item.id);
  const menus = await getMenusByMenuCategoryIds(menuCategoryIds);
  if (!company) return null;
  return (
    <Box>
      <OrderAppHeader company={company} tableId={tableId} />
      <MenuCategoriesTabs
        menuCategories={menuCategories}
        menus={menus}
        tableId={searchParams.tableId}
      />
    </Box>
  );
}
