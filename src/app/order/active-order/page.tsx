import { Box, Button, Divider, Typography } from "@mui/material";
import Link from "next/link";
import { ORDERSTATUS } from "@prisma/client";
import { getTableTotalPrice } from "../cart/actions";
import OrderCard from "@/components/OrderCard";
import { OrdersWithMenusTablesOrderAddons } from "@/app/backoffice/orders/[status]/page";
import { prisma } from "@/libs/prisma";

interface Props {
  searchParams: {
    tableId: string;
  };
}

export default async function ActiveOrderPage({ searchParams }: Props) {
  const tableId = Number(searchParams.tableId);
  const orders: OrdersWithMenusTablesOrderAddons[] =
    await prisma.orders.findMany({
      where: { tableId, NOT: { status: ORDERSTATUS.CART } },
      include: { menu: true, table: true, OrdersAddons: true },
    });
  if (!orders.length) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ mb: 2 }}>
          No active order yet. Go order some tasty menus!
        </Typography>
        <Link href={`/order?tableId=${tableId}`}>
          <Button variant="contained">Go to home page</Button>
        </Link>
      </Box>
    );
  }
  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h5">
          Total price: {getTableTotalPrice(tableId)}
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {orders.map(async (order) => {
          const addonIds = order.OrdersAddons.map((item) => item.addonId);
          const addons = await prisma.addons.findMany({
            where: { id: { in: addonIds } },
            include: { addonCategory: true },
          });
          return <OrderCard key={order.id} order={order} addons={addons} />;
        })}
      </Box>
    </Box>
  );
}
