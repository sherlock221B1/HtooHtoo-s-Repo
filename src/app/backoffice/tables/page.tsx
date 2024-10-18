import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import TableBarIcon from "@mui/icons-material/TableBar";
import { getSelectedLocationTables } from "@/libs/actions";

export default async function TablesPage() {
  const tables = await getSelectedLocationTables();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/tables/new"}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
            }}
          >
            New table
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}>
        {tables.map((table) => (
          <ItemCard
            key={table.id}
            icon={<TableBarIcon fontSize="large" />}
            title={table.name}
            href={`/backoffice/tables/${table.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
