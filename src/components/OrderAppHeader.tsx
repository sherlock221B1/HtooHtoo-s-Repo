import { Box, Typography } from "@mui/material";
import { Company } from "@prisma/client";
import Image from "next/image";
import { CartButton } from "./CartButton";

interface Props {
  company: Company;
  tableId: number;
  headerMenuImageUrl?: string;
}

export function OrderAppHeader({
  company,
  tableId,
  headerMenuImageUrl,
}: Props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CartButton tableId={tableId} />
      <Box
        sx={{
          bgcolor: "#1B9C85",
          height: 60,
          px: 2,
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#F1FAEE",
          }}
        >
          {company?.name}
        </Typography>
        <Image
          src={headerMenuImageUrl || ""}
          alt="menu-image"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
            margin: "0 auto",
            marginTop: 250,
          }}
        />
      </Box>
      <Box
        sx={{
          width: "100vw",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src="/order-app-header.svg"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          alt="header-image"
        />
        <Box sx={{ position: "absolute" }}>
          <Box sx={{ textAlign: "center" }}>
            {headerMenuImageUrl ? (
              <Image
                src={headerMenuImageUrl}
                alt="menu-image"
                width={150}
                height={150}
                style={{
                  borderRadius: "50%",
                  margin: "0 auto",
                  marginTop: 20,
                }}
              />
            ) : (
              <>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#F1FAEE",
                    mt: { xs: 1, md: 2, lg: 4, xl: 10 },
                    fontSize: { sm: 25, md: 30, lg: 40 },
                  }}
                >
                  {company?.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    lineHeight: 1.2,
                    color: "#F1FAEE",
                    opacity: 0.7,
                  }}
                >
                  {company?.name}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
