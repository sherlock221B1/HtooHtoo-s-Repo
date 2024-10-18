import { config } from "@/config";
import { redirect } from "next/navigation";

export default async function BackofficePage() {
  console.log("#######################");
  console.log(config);
  console.log("######################");
  redirect("/backoffice/orders/pending");
}
