import { Box, Card, Divider, Typography } from "@mui/material";
import {
  AddonsWithAddonCategories,
  OrdersWithMenusTablesOrderAddons,
} from "@/app/backoffice/orders/[status]/page";
import { getTotalPriceByOrderId } from "@/app/backoffice/orders/actions";
import { OrderStatusUpdate } from "./OrderStatusUpdate";
import { useEffect } from "react";

interface Props {
  order: OrdersWithMenusTablesOrderAddons;
  addons: AddonsWithAddonCategories[];
  isAdmin?: boolean;
}

export async function OrderCard({ order, addons, isAdmin }: Props) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 280,
        height: 280,
        mt: 2,
        mr: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#457B9D",
          color: "white",
          px: 1,
          py: 1,
        }}
      >
        <Typography>{order.menu.name}</Typography>
        <Typography>
          {isAdmin
            ? order.table.name
            : `$${await getTotalPriceByOrderId(order.id)}`}
        </Typography>
      </Box>
      <Box sx={{ px: 2, pt: 1 }}>
        <Box sx={{ height: 260 * 0.7, overflow: "scroll" }}>
          {order.OrdersAddons.length > 0 ? (
            order.OrdersAddons.map(async (orderAddon) => {
              const addon = addons.find(
                (addon) => addon.id === orderAddon.addonId
              );
              return (
                <Box key={orderAddon.id} sx={{ mb: 2 }}>
                  <Typography>{addon?.addonCategory.name}</Typography>
                  <Typography
                    key={addon?.id}
                    sx={{
                      fontSize: 14,
                      ml: 2,
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    {addon?.name}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography>No addon</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Divider />
      <OrderStatusUpdate order={order} isAdmin={isAdmin} />
    </Card>
  );
}

export default OrderCard;
