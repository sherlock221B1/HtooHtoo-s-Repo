"use client";

import { updateOrderStatus } from "@/app/backoffice/orders/actions";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { Orders, ORDERSTATUS } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  order: Orders;
  isAdmin?: boolean;
}

export function OrderStatusUpdate({ order, isAdmin }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (order.status !== ORDERSTATUS.COMPLETE) {
      const intervalId = setInterval(() => {
        router.refresh();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [order]);

  const handleOrderStatusUpdate = async (
    evt: SelectChangeEvent<"CART" | "PENDING" | "COOKING" | "COMPLETE">
  ) => {
    await updateOrderStatus(order.id, evt.target.value as ORDERSTATUS);
  };

  return (
    <Box
      sx={{
        px: 2,
        display: "flex",
        alignItems: "center",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      {isAdmin ? (
        <>
          <Typography sx={{ fontWeight: "bold" }}>Status: </Typography>
          <Select
            value={order.status}
            sx={{ maxHeight: 30 }}
            onChange={handleOrderStatusUpdate}
          >
            <MenuItem value={ORDERSTATUS.PENDING}>
              {ORDERSTATUS.PENDING}
            </MenuItem>
            <MenuItem value={ORDERSTATUS.COOKING}>
              {ORDERSTATUS.COOKING}
            </MenuItem>
            <MenuItem value={ORDERSTATUS.COMPLETE}>
              {ORDERSTATUS.COMPLETE}
            </MenuItem>
          </Select>
        </>
      ) : (
        <>
          <Typography sx={{ fontWeight: "bold" }}>Status:</Typography>
          <Typography sx={{ fontWeight: "bold" }}>{order.status}</Typography>
        </>
      )}
    </Box>
  );
}
