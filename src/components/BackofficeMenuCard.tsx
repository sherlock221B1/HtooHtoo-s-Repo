import React from "react";
import { getSelectedLocation } from "@/libs/actions";
import MenuCard from "./MenuCard";

interface Props {
  menu: any;
}

export default async function BackofficeMenuCard({ menu }: Props) {
  const selectedLocation = await getSelectedLocation();
  const { id, name, price } = menu;
  const disabledLoationMenus = menu.DisabledLocationsMenus[0];
  const isAvailable =
    disabledLoationMenus &&
    disabledLoationMenus.locationId === selectedLocation?.locationId
      ? false
      : true;
  const imageUrl = menu.imageUrl
    ? menu.imageUrl
    : "https://images.squarespace-cdn.com/content/v1/5a81c36ea803bb1dd7807778/1610403788186-K2ATWJRYLHVC4ENCZZ7D/Shan+khaut+swe+%28Shan+sticky+noodles%29";
  return (
    <MenuCard
      name={name}
      price={price}
      imageUrl={imageUrl}
      href={`/backoffice/menus/${id}`}
      showIsAvaialble
      isAvailable={isAvailable}
    />
  );
}
