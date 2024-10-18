import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import ClassIcon from "@mui/icons-material/Class";
import { getCompanyAddonCategories } from "@/libs/actions";

export default async function AddonCategoriesPage() {
  const addonCategories = await getCompanyAddonCategories();

  return (
    <>
      <h1></h1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/addon-categories/new"}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
            }}
          >
            New addon category
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex" }}>
        {addonCategories.map((addonCategory) => (
          <ItemCard
            key={addonCategory.id}
            icon={<ClassIcon fontSize="large" />}
            title={addonCategory.name}
            href={`/backoffice/addon-categories/${addonCategory.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
