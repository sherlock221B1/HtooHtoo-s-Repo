import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardMedia,
} from "@mui/material";
import Link from "next/link";
import { getSelectedLocation } from "@/libs/actions";
import { integerToMyanmar } from "@/libs/generals";

interface Props {
  href: string;
  imageUrl: string;
  name: string;
  price: number | null;
  isAvailable?: boolean;
  showIsAvaialble?: boolean;
}

export default function MenuCard({
  href,
  imageUrl,
  name,
  price,
  isAvailable,
  showIsAvaialble,
}: Props) {
  const priceInMyanmar = integerToMyanmar(price || 0);
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 285,
          borderRadius: 2,
          mr: 3,
          mb: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Menu Item"
          sx={{
            width: "100%",
            height: 100,
            borderRadius: "8px 8px 0 0",
            objectFit: "cover",
          }}
        />
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mr={2}>
              {name}
            </Typography>
            <Chip
              label={`${priceInMyanmar}`}
              variant="filled"
              sx={{
                bgcolor: "#A8DADC",
                color: "#1D3557",
                fontWeight: "medium",
              }}
            />
          </Box>
          {showIsAvaialble && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Chip
                label={isAvailable ? "Available" : "Sold out"}
                variant="outlined"
                sx={{
                  fontWeight: "medium",
                  bgcolor: isAvailable ? "#DCFCE6" : "#E63946",
                  color: isAvailable ? "#1D3557" : "#F1FAEE",
                  border: 0,
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
