import { ReactNode } from "react";
import { Box } from "@mui/material";
import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactNode;
}

export default function BackofficeLayout({ children }: Props) {
  return (
    <Box>
      <Topbar />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ p: 2, width: "100%" }}>{children}</Box>
      </Box>
      <Toaster position="bottom-right" />
    </Box>
  );
}
