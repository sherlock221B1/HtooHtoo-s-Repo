"use client";

import { Checkbox, FormControlLabel } from "@mui/material";
import { Locations } from "@prisma/client";

interface Props {
  id: string;
  locations: Locations[];
}

export default function LocationCheckbox({ id, locations }: Props) {
  if (!localStorage) return null;
  return (
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked={id === localStorage.getItem("currentLocationId")}
          name="menuCategories"
          onChange={(_, checked) => {
            if (checked) {
              localStorage.setItem("currentLocationId", id);
            } else {
              localStorage.setItem(
                "currentLocationId",
                String(locations[0].id)
              );
            }
          }}
        />
      }
      label={"Current location"}
    />
  );
}
