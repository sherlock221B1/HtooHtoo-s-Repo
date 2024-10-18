"use client";

import { Box, Button } from "@mui/material";
import {
  AddonCategories as AddonCategoriesType,
  Addons,
  Menus,
  Orders,
} from "@prisma/client";
import { AddonCategoriesAndAddonOns } from "./AddonCategoriesAndAddonOns";
import QuantitySelector from "./QuantitySelector";
import { useEffect, useState } from "react";
import { createCartOrder } from "@/app/order/cart/actions";
import { OrdersWithOrdersAddons } from "@/app/order/menus/[id]/page";

interface Props {
  menu: Menus;
  addonCategories: AddonCategoriesType[];
  addons: Addons[];
  tableId: number;
  order: OrdersWithOrdersAddons | null;
}

export function MenuOptions({
  menu,
  addonCategories,
  addons,
  tableId,
  order,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addons[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const requiredAddonCategories = addonCategories.filter(
      (item) => item.isRequired
    );
    const selectedRequiredAddons = selectedAddons.filter((selectedAddon) => {
      const addonCategory = addonCategories.find(
        (item) => item.id === selectedAddon.addonCategoryId
      );
      return addonCategory?.isRequired ? true : false;
    });
    const isDisabled =
      requiredAddonCategories.length !== selectedRequiredAddons.length;
    setIsDisabled(isDisabled);
  }, [selectedAddons, addonCategories]);

  useEffect(() => {
    if (order) {
      const { quantity, OrdersAddons } = order;
      const addonIds = OrdersAddons.map((item) => item.addonId);
      const selectedAddons = addons.filter((addon) =>
        addonIds.includes(addon.id)
      );
      setSelectedAddons(selectedAddons);
      setQuantity(quantity);
    }
  }, [order]);

  const handleQuantityIncrease = () => {
    const newValue = quantity + 1;
    setQuantity(newValue);
  };

  const handleQuantityDecrease = () => {
    const newValue = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newValue);
  };

  const handleCreateOrUpdateCartOrder = async () => {
    await createCartOrder({
      menuId: menu.id,
      addonIds: selectedAddons.map((item) => item.id),
      quantity,
      tableId,
      orderId: order?.id,
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 10,
        px: 2,
        position: "relative",
        marginTop: { xs: 25, md: -5, lg: -10 },
      }}
    >
      <AddonCategoriesAndAddonOns
        addonCategories={addonCategories}
        addons={addons}
        selectedAddons={selectedAddons}
        setSelectedAddons={setSelectedAddons}
      />
      <QuantitySelector
        value={quantity}
        onDecrease={handleQuantityDecrease}
        onIncrease={handleQuantityIncrease}
      />
      <Button
        variant="contained"
        disabled={isDisabled}
        onClick={handleCreateOrUpdateCartOrder}
        sx={{
          width: "fit-content",
          mt: 2,
        }}
      >
        {order ? "Update" : "Add to cart"}
      </Button>
    </Box>
  );
}
