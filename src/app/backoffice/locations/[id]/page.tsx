import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { deleteLocation, getLocation, updateLocation } from "../actions";
import { getSelectedLocation } from "@/libs/actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function LocationUpdatePage({ params }: Props) {
  const { id } = params;
  const location = await getLocation(Number(id));
  const selectedLocation = await getSelectedLocation();
  const isSelected = Number(id) === selectedLocation?.locationId;

  return (
    <>
      <Box
        component={"form"}
        action={deleteLocation}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <input hidden defaultValue={id} name="id" />
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
        action={updateLocation}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <input hidden defaultValue={id} name="id" />
        <TextField defaultValue={location.name} label="Name" name="name" />
        <FormControlLabel
          control={
            <Checkbox
              name="selected"
              value={isSelected ? true : false}
              defaultChecked={isSelected}
            />
          }
          label={"Selected location"}
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
