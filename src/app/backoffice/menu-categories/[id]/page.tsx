import { prisma } from "@/libs/prisma";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { deleteMenuCategory, updateMenuCategory } from "../actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function UpdateMenuCategoryPage({ params }: Props) {
  const { id } = params;
  const menuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(id) },
    include: { DisabledLocationMenuCategories: true },
  });
  const isAvailable = menuCategory?.DisabledLocationMenuCategories.length
    ? false
    : true;

  return (
    <Box>
      <Box
        component={"form"}
        action={deleteMenuCategory}
        sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
      >
        <input type="hidden" value={id} name="id" />
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
        action={updateMenuCategory}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <TextField defaultValue={menuCategory?.name} name="name" />
        <FormControlLabel
          control={<Checkbox defaultChecked={isAvailable} />}
          label="Available"
          name="isAvailable"
        />
        <input type="hidden" value={id} name="id" />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
