"use server";

import { getCompanyId } from "@/libs/actions";
import { prisma } from "@/libs/prisma";

export async function getCompany() {
  const companyId = await getCompanyId();
  return await prisma.company.findFirst({ where: { id: companyId } });
}

export async function updateCompany(formData: FormData) {
  const id = formData.get("id");
  const name = formData.get("name") as string;
  await prisma.company.update({
    data: { name },
    where: { id: Number(id) },
  });
}
