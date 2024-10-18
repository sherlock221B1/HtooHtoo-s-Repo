import { prisma } from "@/libs/prisma";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { getCompany, updateCompany } from "./actions";

export default async function UpdateCompanyPage() {
  const company = await getCompany();

  return (
    <Box>
      <Box
        component={"form"}
        action={updateCompany}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <TextField defaultValue={company?.name} name="name" />
        <input type="hidden" defaultValue={company?.id} name="id" />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
