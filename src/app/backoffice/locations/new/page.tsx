import { Box, Button, TextField } from "@mui/material";
import { createLocation } from "../actions";

export default async function NewLocationPage() {
  return (
    <Box
      component={"form"}
      action={createLocation}
      sx={{ mt: 2, display: "flex", flexDirection: "column" }}
    >
      <TextField placeholder="Name" label="Name" name="name" />
      <Button
        variant="contained"
        sx={{ width: "fit-content", mt: 3 }}
        type="submit"
      >
        Create
      </Button>
    </Box>
  );
}
