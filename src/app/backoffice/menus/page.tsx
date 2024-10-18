import BackofficeMenuCard from "@/components/BackofficeMenuCard";
import { getCompanyMenus } from "@/libs/actions";
import { Box, Button } from "@mui/material";
import Link from "next/link";

export default async function MenusPage() {
  const menus = await getCompanyMenus();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/menus/new"}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
            }}
          >
            New menu
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}>
        {menus.map((menu) => (
          <BackofficeMenuCard key={menu.id} menu={menu} />
        ))}
      </Box>
    </>
  );
}
