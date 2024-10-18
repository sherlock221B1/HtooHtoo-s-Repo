import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { deleteAddon, getAddon, updateAddon } from "../actions";
import { getCompanyAddonCategories } from "@/libs/actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function AddonUpdatePage({ params }: Props) {
  const { id } = params;
  const addon = await getAddon(Number(id));
  const addonCategories = await getCompanyAddonCategories();

  return (
    <>
      <Box
        component={"form"}
        action={deleteAddon}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <input hidden value={id} name="id" />
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
        action={updateAddon}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <input hidden value={id} name="id" />
        <TextField defaultValue={addon.name} label="Name" name="name" />
        <TextField
          defaultValue={addon.price}
          sx={{ my: 2 }}
          label="Price"
          name="price"
        />
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
                    name="addonCategoryId"
                    value={addonCategory.id}
                    defaultChecked={addonCategory.id === addon.addonCategoryId}
                  />
                }
                label={addonCategory.name}
              />
            ))}
          </Box>
        </Box>
        <FormControlLabel
          control={
            <Checkbox defaultChecked={addon.isAvailable} name="isAvailable" />
          }
          label="Available"
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
