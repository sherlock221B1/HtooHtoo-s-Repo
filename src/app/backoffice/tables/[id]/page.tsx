import { Box, Button, TextField } from "@mui/material";
import { deleteTable, getTable, updateTable } from "../actions";
import QrImage from "@/components/QrImage";

interface Props {
  params: {
    id: string;
  };
}

export default async function TableUpdatePage({ params }: Props) {
  const { id } = params;
  const table = await getTable(Number(id));

  return (
    <>
      <Box
        component={"form"}
        action={deleteTable}
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
      <QrImage qrImageUrl={table.qrCodeImageUrl} />
      <Box
        component={"form"}
        action={updateTable}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <input hidden value={id} name="id" />
        <TextField defaultValue={table.name} label="Name" name="name" />

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
