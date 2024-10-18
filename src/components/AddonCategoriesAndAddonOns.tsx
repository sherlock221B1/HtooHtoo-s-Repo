"use client";

import { Box, Chip, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AddonCategories, Addons as AddonType } from "@prisma/client";
import { Addons } from "./Addons";

interface Props {
  addonCategories: AddonCategories[];
  addons: AddonType[];
  selectedAddons: AddonType[];
  setSelectedAddons: Dispatch<SetStateAction<AddonType[]>>;
}

export function AddonCategoriesAndAddonOns({
  addonCategories,
  addons,
  selectedAddons,
  setSelectedAddons,
}: Props) {
  return (
    <Box sx={{ width: "100%" }}>
      {addonCategories.map((item) => {
        const addonCategoryAddons = addons.filter(
          (addon) => addon.addonCategoryId === item.id
        );
        return (
          <Box key={item.id} sx={{ mb: 5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ userSelect: "none" }}>
                {item.name}
              </Typography>
              <Chip label={item.isRequired ? "Required" : "Optional"} />
            </Box>
            <Box sx={{ pl: 1, mt: 2 }}>
              <Addons
                addonCategory={item}
                addonCategoryAddons={addonCategoryAddons}
                selectedAddons={selectedAddons}
                setSelectedAddons={setSelectedAddons}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
