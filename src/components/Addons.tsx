import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { AddonCategories, Addons as AddonType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategory: AddonCategories;
  addonCategoryAddons: AddonType[];
  selectedAddons: AddonType[];
  setSelectedAddons: Dispatch<SetStateAction<AddonType[]>>;
}

export function Addons({
  addonCategory,
  addonCategoryAddons,
  selectedAddons,
  setSelectedAddons,
}: Props) {
  if (!addonCategory) return null;
  return (
    <Box>
      {addonCategoryAddons.map((addonCategoryAddon) => {
        return (
          <Box
            key={addonCategoryAddon.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                addonCategory.isRequired ? (
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "#289D8F",
                      },
                    }}
                    checked={
                      selectedAddons.find(
                        (item) => item.id === addonCategoryAddon.id
                      )
                        ? true
                        : false
                    }
                    onChange={() => {
                      const addonIds = addonCategoryAddons.map(
                        (item) => item.id
                      );
                      const others = selectedAddons.filter(
                        (item) => !addonIds.includes(item.id)
                      );
                      setSelectedAddons([...others, addonCategoryAddon]);
                    }}
                  />
                ) : (
                  <Checkbox
                    sx={{
                      "&.Mui-checked": {
                        color: "#289D8F",
                      },
                    }}
                    checked={
                      selectedAddons.find(
                        (item) => item.id === addonCategoryAddon.id
                      )
                        ? true
                        : false
                    }
                    onChange={(evt, value) => {
                      if (value) {
                        setSelectedAddons([
                          ...selectedAddons,
                          addonCategoryAddon,
                        ]);
                      } else {
                        const selected = selectedAddons.filter(
                          (item) => item.id !== addonCategoryAddon.id
                        );
                        setSelectedAddons(selected);
                      }
                    }}
                  />
                )
              }
              label={addonCategoryAddon.name}
            />
            <Typography sx={{ fontStyle: "italic" }}>
              {addonCategoryAddon.price}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
