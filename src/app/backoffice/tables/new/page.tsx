import { Box, Button, TextField } from "@mui/material";
import { createTable } from "../actions";

export default function NewTablePage() {
  return (
    <Box
      component={"form"}
      action={createTable}
      sx={{ mt: 2, display: "flex", flexDirection: "column" }}
    >
      <TextField placeholder="Name" label="Name" name="name" />
      <Button
        type="submit"
        variant="contained"
        sx={{ width: "fit-content", mt: 3 }}
      >
        Create
      </Button>
    </Box>
  );
}
