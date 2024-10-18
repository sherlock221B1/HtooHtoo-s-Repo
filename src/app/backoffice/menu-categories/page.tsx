import ItemCard from "@/components/ItemCard";
import { Box, Button, Card } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import Link from "next/link";
import { getCompanyMenuCategories, getSelectedLocation } from "@/libs/actions";

export default async function MenuCategoriesPage() {
  const menuCategories = await getCompanyMenuCategories();
  const selectedLocationId = (await getSelectedLocation())?.locationId;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/menu-categories/new"}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
            }}
          >
            New menu category
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}>
        {menuCategories.map((menuCategory) => {
          const isAvailable = menuCategory.DisabledLocationMenuCategories.find(
            (item) =>
              item.menuCategoryId === menuCategory.id &&
              item.locationId === selectedLocationId
          )
            ? false
            : true;
          return (
            <ItemCard
              key={menuCategory.id}
              icon={<CategoryIcon fontSize="large" />}
              title={menuCategory.name}
              href={`/backoffice/menu-categories/${menuCategory.id}`}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
    </>
  );
}
