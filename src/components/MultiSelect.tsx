import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { MenuCategories, Menus } from "@prisma/client";
import { SetStateAction } from "react";

interface Props {
  title: string;
  selected: number[];
  setSelected: (value: SetStateAction<number[]>) => void;
  items: MenuCategories[] | Menus[];
}

const MultiSelect = ({ title, selected, setSelected, items }: Props) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel>{title}</InputLabel>
      <Select
        value={selected}
        multiple
        input={<OutlinedInput label={title} />}
        onChange={(evt) => {
          const selected = evt.target.value as number[];
          setSelected(selected);
        }}
        renderValue={() => {
          return selected
            .map((itemId) => items.find((item) => item.id === itemId))
            .map((item) => item?.name)
            .join(", ");
        }}
      >
        {items.map((item) => {
          return (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={selected.includes(item.id)} />
              <ListItemText>{item.name}</ListItemText>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
