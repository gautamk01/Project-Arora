"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { CreateFunnelFormSchema, UpsertFunnelPage } from "../type";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v4 } from "uuid";
import { FunnelProduct } from "@prisma/client";

export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
  funnelId: string
) => {
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId || v4(),
      subAccountId: subaccountId,
    },
  });

  return response;
};

export const upsertFunnelProduct = async (FunnelProduct: FunnelProduct) => {
  try {
    const response = await db.funnelProduct.upsert({
      where: { id: FunnelProduct.id },
      update: FunnelProduct,
      create: {
        ...FunnelProduct,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFunnelsProduct = async (funnelId: string) => {
  const funnels = await db.funnelProduct.findMany({
    where: { funnelId: funnelId },
  });

  return funnels;
};
export const getFunnels = async (subacountId: string) => {
  const funnels = await db.funnel.findMany({
    where: { subAccountId: subacountId },
    include: { FunnelPages: true },
  });

  return funnels;
};

export const getFunnel = async (funnelId: string) => {
  const funnel = await db.funnel.findUnique({
    where: { id: funnelId },
    include: {
      FunnelPages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return funnel;
};
export const getFunnelPages = async (funnelId: string) => {
  const funnel = await db.funnelPage.findMany({
    where: { id: funnelId },
  });

  return funnel;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  const data = await db.funnel.update({
    where: { id: funnelId },
    data: { liveProducts: products },
  });
  return data;
};

//create a webpage
export const upsertFunnelPage = async (
  subaccountId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string
) => {
  if (!subaccountId || !funnelId) return;

  const response = await db.funnelPage.upsert({
    where: { id: funnelPage.id || "" },
    update: { ...funnelPage },
    create: {
      ...funnelPage,
      //this section is mainly for the website editor
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              style: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
      funnelId,
    },
  });

  return response;
};
export const DeleteFunnel = async (subaccountId: string, funnelId: string) => {
  if (!subaccountId || !funnelId) return;
  const response = await db.funnel.delete({ where: { id: funnelId } });
  revalidatePath(`/subaccount/${subaccountId}/funnels`, "page");
  return response;
};

export const deleteFunnelePage = async (
  funnelPageId: string,
  funnelId: string,
  subaccountId: string
) => {
  const response = await db.funnelPage.delete({ where: { id: funnelPageId } });

  redirect(`/subaccount/${subaccountId}/funnels/${funnelId}`);

  return response;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.funnelPage.findUnique({
    where: {
      id: funnelPageId,
    },
  });
  return response;
};

export const getDomainContent = async (subDomainName: string) => {
  const response = await db.funnel.findUnique({
    where: {
      subDomainName,
    },
    include: { FunnelPages: true },
  });
  return response;
};
