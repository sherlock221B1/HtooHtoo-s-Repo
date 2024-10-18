import { Box, Button, TextField } from "@mui/material";
import { createNewMenuCategory } from "../actions";

export default function NewMenuCategoryPage() {
  return (
    <Box
      component={"form"}
      action={createNewMenuCategory}
      sx={{ mt: 2, display: "flex", flexDirection: "column" }}
    >
      <TextField placeholder="Name" defaultValue={""} name="name" />
      <Button
        variant="contained"
        type="submit"
        sx={{
          bgcolor: "#1D3557",
          width: "fit-content",
          mt: 3,
          "&:hover": { bgcolor: "#2d4466" },
        }}
      >
        Create
      </Button>
    </Box>
  );
}
