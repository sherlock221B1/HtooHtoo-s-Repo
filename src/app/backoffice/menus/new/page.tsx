import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { createMenu } from "../actions";
import { getCompanyMenuCategories } from "@/libs/actions";
import { NewMenuForm } from "./NewMenuForm";

export default async function NewMenuPage() {
  const menuCategories = await getCompanyMenuCategories();

  return <NewMenuForm menuCategories={menuCategories} />;
}
