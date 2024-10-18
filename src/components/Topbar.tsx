import { getCompanyLocations, getSelectedLocation } from "@/libs/actions";
import SignOutButton from "./SignOutButton";

export async function Topbar() {
  const selectedLocation = await getSelectedLocation();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#E63946",
        color: "#F1FAEE",
        height: "65px",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <h2>Foodie POS</h2>
      <h2>{selectedLocation?.location.name}</h2>
      <SignOutButton />
    </div>
  );
}
