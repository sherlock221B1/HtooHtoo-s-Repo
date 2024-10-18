"use client";

import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";
import { createMenu } from "../actions";
import { MenuCategories } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { upload } from "@vercel/blob/client";

interface Props {
  menuCategories: MenuCategories[];
}

export function NewMenuForm({ menuCategories }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateMenuClientUpload = async (formData: FormData) => {
    try {
      setLoading(true);
      const file = formData.get("file") as File;
      if (file.size) {
        const { url } = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        formData.set("imageUrl", url);
      }
      const response = await createMenu(formData);
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Success");
        router.push("/backoffice/menus");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Box
      component={"form"}
      action={handleCreateMenuClientUpload}
      sx={{ mt: 2, display: "flex", flexDirection: "column" }}
    >
      <TextField placeholder="Name" label="Name" name="name" />
      <TextField
        placeholder="Price"
        sx={{ my: 2 }}
        label="Price"
        name="price"
      />
      <Box>
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
                <Checkbox name="menuCategories" value={menuCategory.id} />
              }
              label={menuCategory.name}
            />
          ))}
        </Box>
      </Box>
      <TextField type="file" name="file" sx={{ mt: 2 }} />
      <FormControlLabel
        control={<Checkbox defaultChecked name="isAvailable" />}
        label="Available"
      />
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <Button
          variant="contained"
          sx={{ width: "fit-content", mt: 3 }}
          type="submit"
        >
          Create
        </Button>
      )}
    </Box>
  );
}
