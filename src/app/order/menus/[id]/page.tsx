import { MenuOptions } from "@/components/MenuOptions";
import { OrderAppHeader } from "@/components/OrderAppHeader";
import { getCompanyByTableId } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { Box } from "@mui/material";
import { Prisma } from "@prisma/client";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    tableId: string;
    orderId: string;
  };
}

export type OrdersWithOrdersAddons = Prisma.OrdersGetPayload<{
  include: { OrdersAddons: true };
}>;

export default async function MenuDetailsPage({ params, searchParams }: Props) {
  const { tableId, orderId } = searchParams;
  const company = await getCompanyByTableId(Number(tableId));
  const menu = await prisma.menus.findFirst({
    where: { id: Number(params.id) },
    include: { menusAddonCategories: true },
  });
  const addonCategoryIds = menu?.menusAddonCategories.map(
    (item) => item.addonCategoryId
  );
  const addonCategories = await prisma.addonCategories.findMany({
    where: { id: { in: addonCategoryIds } },
  });
  const addons = await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds } },
  });

  let order: OrdersWithOrdersAddons | null = null;
  if (orderId) {
    order = await prisma.orders.findFirst({
      where: { id: Number(orderId) },
      include: { OrdersAddons: true },
    });
  }
  if (!menu || !company) return null;

  return (
    <Box>
      <OrderAppHeader
        company={company}
        tableId={Number(tableId)}
        headerMenuImageUrl={menu.imageUrl as string}
      />
      <MenuOptions
        menu={menu}
        addonCategories={addonCategories}
        addons={addons}
        tableId={Number(tableId)}
        order={order}
      />
    </Box>
  );
}
