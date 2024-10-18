import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { getCompanyLocations } from "@/libs/actions";
import LocationOn from "@mui/icons-material/LocationOn";

export default async function LocationsPage() {
  const locations = await getCompanyLocations();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/locations/new"}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
            }}
          >
            New location
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}>
        {locations.map((location) => (
          <ItemCard
            key={location.id}
            icon={<LocationOn fontSize="large" />}
            title={location.name}
            href={`/backoffice/locations/${location.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
