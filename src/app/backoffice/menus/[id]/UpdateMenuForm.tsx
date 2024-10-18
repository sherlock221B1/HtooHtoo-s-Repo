"use client";

import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { deleteMenu, updateMenu } from "../actions";
import { AddonCategories, MenuCategories, Menus } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import React from "react";
import Image from "next/image";

interface Props {
  menu: Menus;
  isAvailable: boolean;
  menuCategories: MenuCategories[];
  selectedMenuCategoryIds: number[];
  addonCategories: AddonCategories[];
  selectedAddonCategoryIds: number[];
}

export function UpdateMenuForm({
  menu,
  menuCategories,
  isAvailable,
  selectedMenuCategoryIds,
  addonCategories,
  selectedAddonCategoryIds,
}: Props) {
  const router = useRouter();

  const handleUpdateMenu = async (formData: FormData) => {
    const file = formData.get("file") as File;
    if (file.size) {
      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      formData.set("imageUrl", url);
    }
    const response = await updateMenu(formData);
    if (response?.errors) {
      response.errors.forEach((error) => toast.error(error.message));
    } else {
      toast.success("Success");
      router.push("/backoffice/menus");
    }
  };

  return (
    <>
      <Box
        component={"form"}
        action={deleteMenu}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <input hidden defaultValue={menu.id} name="id" />
        <Button
          type="submit"
          variant="contained"
          sx={{ width: "fit-content" }}
          color="error"
        >
          Delete
        </Button>
      </Box>
      <Box
        component={"form"}
        action={handleUpdateMenu}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <input hidden defaultValue={menu.id} name="id" />
        <TextField defaultValue={menu?.name} name="name" />
        <TextField defaultValue={menu?.price} sx={{ mt: 2 }} name="price" />
        <Box sx={{ my: 2 }}>
          <Typography>Menu categories</Typography>
          <Box
            sx={{
              border: "1px solid lightgray",
              px: 1.2,
              py: 1,
              borderRadius: 1,
            }}
          >
            {menuCategories.map((menuCategory) => (
              <FormControlLabel
                key={menuCategory.id}
                control={
                  <Checkbox
                    defaultChecked={selectedMenuCategoryIds?.includes(
                      menuCategory.id
                    )}
                    name="menuCategories"
                    value={menuCategory.id}
                  />
                }
                label={menuCategory.name}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography>Addon categories</Typography>
          <Box
            sx={{
              border: "1px solid lightgray",
              px: 1.2,
              py: 1,
              borderRadius: 1,
            }}
          >
            {addonCategories.map((addonCategory) => (
              <FormControlLabel
                key={addonCategory.id}
                control={
                  <Checkbox
                    defaultChecked={selectedAddonCategoryIds?.includes(
                      addonCategory.id
                    )}
                    name="addonCategories"
                    value={addonCategory.id}
                  />
                }
                label={addonCategory.name}
              />
            ))}
          </Box>
        </Box>
        <Image
          src={menu.imageUrl || ""}
          width={100}
          height={100}
          alt="menu image"
          style={{ marginTop: "10px" }}
        />
        <TextField type="file" name="file" sx={{ mt: 2 }} />
        <FormControlLabel
          control={<Checkbox defaultChecked={isAvailable} />}
          label="Available"
          name="isAvailable"
        />

        <Button
          variant="contained"
          sx={{ width: "fit-content", mt: 3 }}
          type="submit"
        >
          Update
        </Button>
      </Box>
    </>
  );
}
