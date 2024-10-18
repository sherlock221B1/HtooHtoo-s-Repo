import { OrderCard } from "@/components/OrderCard";
import { getSelectedLocation, getSelectedLocationTables } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { Box, Button, ButtonGroup, Link } from "@mui/material";
import { ORDERSTATUS, Prisma } from "@prisma/client";

interface Props {
  params: {
    status: ORDERSTATUS;
  };
}

export type OrdersWithMenusTablesOrderAddons = Prisma.OrdersGetPayload<{
  include: { menu: true; table: true; OrdersAddons: true };
}>;

export type AddonsWithAddonCategories = Prisma.AddonsGetPayload<{
  include: { addonCategory: true };
}>;

export default async function OrdersWithStatusPage({ params }: Props) {
  const status = params.status.toUpperCase();
  const tables = await getSelectedLocationTables();
  const tableIds = tables.map((table) => table.id);
  const orders: OrdersWithMenusTablesOrderAddons[] =
    await prisma.orders.findMany({
      where: {
        tableId: { in: tableIds },
        status: status as ORDERSTATUS,
      },
      include: { menu: true, table: true, OrdersAddons: true },
    });
  return (
    <Box>
      <ButtonGroup
        variant="outlined"
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Link href={"/backoffice/orders/pending"}>
          <Button
            variant={`${
              status === ORDERSTATUS.PENDING ? "contained" : "outlined"
            }`}
          >
            PENDING
          </Button>
        </Link>
        <Link href={"/backoffice/orders/cooking"}>
          <Button
            variant={`${
              status === ORDERSTATUS.COOKING ? "contained" : "outlined"
            }`}
          >
            COOKING
          </Button>
        </Link>
        <Link href={"/backoffice/orders/complete"}>
          <Button
            variant={`${
              status === ORDERSTATUS.COMPLETE ? "contained" : "outlined"
            }`}
          >
            COMPLETE
          </Button>
        </Link>
      </ButtonGroup>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {orders.map(async (order) => {
          const addonIds = order.OrdersAddons.map((item) => item.addonId);
          const addons: AddonsWithAddonCategories[] =
            await prisma.addons.findMany({
              where: { id: { in: addonIds } },
              include: { addonCategory: true },
            });

          return (
            <OrderCard key={order.id} order={order} addons={addons} isAdmin />
          );
        })}
      </Box>
    </Box>
  );
}
