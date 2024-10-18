import { Box, Button, Divider, Typography } from "@mui/material";
import {
  confirmCartOrder,
  deleteCartOrder,
  getTableTotalPrice,
} from "./actions";
import Link from "next/link";
import { ORDERSTATUS } from "@prisma/client";
import { prisma } from "@/libs/prisma";

interface Props {
  searchParams: {
    tableId: string;
  };
}

export default async function CartPage({ searchParams }: Props) {
  const tableId = Number(searchParams.tableId);
  const cartOrders = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
    include: { menu: true },
  });
  if (!cartOrders.length) {
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
          Cart is empty. Go order some tasty menus!
        </Typography>
        <Link href={`/order?tableId=${tableId}`}>
          <Button variant="contained">Go to home page</Button>
        </Link>
      </Box>
    );
  }
  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ maxWidth: 600, margin: "0 auto" }}>
        {cartOrders.map(async (cartOrder) => {
          const { id, menu, quantity } = cartOrder;
          const orderAddons = await prisma.ordersAddons.findMany({
            where: { orderId: id },
            include: { addon: true },
          });
          const addons = orderAddons.map((item) => item.addon);
          return (
            <Box key={cartOrder.id} sx={{ mb: 5 }}>
              <Box
                key={cartOrder.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: "green",
                      borderRadius: "50%",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mr: 2,
                    }}
                  >
                    {quantity}
                  </Typography>
                  <Typography>{menu.name}</Typography>
                </Box>
                <Typography>{menu.price}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", ml: 6 }}>
                {addons.map((addon) => {
                  return (
                    <Box
                      key={addon.id}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography fontStyle={"italic"}>{addon.name}</Typography>
                      <Typography fontStyle={"italic"}>
                        {addon.price}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              <Box display={"flex"} justifyContent={"flex-end"}>
                <Box component={"form"} action={deleteCartOrder}>
                  <input defaultValue={cartOrder.id} hidden name="id" />
                  <Button variant="contained" sx={{ mr: 2 }} type="submit">
                    Delete
                  </Button>
                </Box>
                <Link
                  href={`/order/menus/${cartOrder.menuId}?tableId=${cartOrder.tableId}&orderId=${cartOrder.id}`}
                >
                  <Button variant="contained">Edit</Button>
                </Link>
              </Box>
            </Box>
          );
        })}
        <Divider sx={{ borderBottomWidth: 5 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="h5">
            Total price: {getTableTotalPrice(tableId, ORDERSTATUS.CART)}
          </Typography>
        </Box>
        <Box
          component={"form"}
          action={confirmCartOrder}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <input hidden defaultValue={tableId} name="tableId" />
          <Button variant="contained" type="submit">
            Confirm order
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
