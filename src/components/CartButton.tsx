import { prisma } from "@/libs/prisma";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import Link from "next/link";

interface Props {
  tableId: number;
}

export async function CartButton({ tableId }: Props) {
  const cartOrder = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
  });
  return (
    <Link href={`/order/cart?tableId=${tableId}`}>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          right: { xs: 10, md: 120 },
          top: { xs: 10 },
        }}
      >
        <ShoppingCartCheckoutIcon sx={{ color: "white", fontSize: 40 }} />
        <Typography variant="h4" sx={{ color: "white" }}>
          {cartOrder.length}
        </Typography>
      </Box>
    </Link>
  );
}
