import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import EggIcon from "@mui/icons-material/Egg";
import { prisma } from "@/libs/prisma";
import Link from "next/link";
import ClassIcon from "@mui/icons-material/Class";
import { getCompanyAddons } from "@/libs/actions";

export default async function AddonsPage() {
  const addons = await getCompanyAddons();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/addons/new"}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
            }}
          >
            New addon
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}>
        {addons.map((addon) => (
          <ItemCard
            key={addon.id}
            icon={<EggIcon fontSize="large" />}
            title={addon.name}
            href={`/backoffice/addons/${addon.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
