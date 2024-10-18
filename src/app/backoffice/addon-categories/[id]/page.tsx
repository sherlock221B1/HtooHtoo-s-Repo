import { prisma } from "@/libs/prisma";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { deleteAddonCategory, updateAddonCategory } from "../actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function UpdateAddonCategoryPage({ params }: Props) {
  const { id } = params;
  const addonCategory = await prisma.addonCategories.findFirst({
    where: { id: Number(id) },
  });

  return (
    <Box>
      <Box
        component={"form"}
        action={deleteAddonCategory}
        sx={{ display: "flex", justifyContent: "flex-end" }}
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
        sx={{ display: "flex", flexDirection: "column", mt: 2 }}
        component={"form"}
        action={updateAddonCategory}
      >
        <TextField defaultValue={addonCategory?.name} name="name" />
        <input type="hidden" defaultValue={id} name="id" />
        <FormControlLabel
          control={<Checkbox defaultChecked={addonCategory?.isRequired} />}
          label="Required"
          name="isRequired"
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
