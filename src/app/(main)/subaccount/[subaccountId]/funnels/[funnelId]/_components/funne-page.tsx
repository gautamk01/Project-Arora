"use client";
import BlurPage from "@/components/global/blur-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFunnel } from "@/lib/queries/funnelqueries";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FunnelSteps from "./funnel-step";
import FunnelSettings from "./funnel-settings";
import FunnelProductsTable from "./funnel-product";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import Pusher from "pusher-js";

type Props = {
  funnelId: string;
  subaccountId: string;
};

const FunnelPage = ({ funnelId, subaccountId }: Props) => {
  const [funnelPages, setFunnelPages] = useState<any>(null);

  useEffect(() => {
    async function fetchFunnel() {
      const funnel = await getFunnel(funnelId);
      if (!funnel) {
        return redirect(`/subaccount/${subaccountId}/funnels`);
      } else {
        setFunnelPages(funnel);
      }
    }

    fetchFunnel();
  }, [funnelId, subaccountId]);

  // Render null or a loader until the funnel data is fetched
  if (!funnelPages) return <div>Loading...</div>;

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${subaccountId}/funnels`}
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
      >
        Back
      </Link>
      <h1 className="text-3xl mb-8">{funnelPages.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid grid-cols-3 w-[50%] bg-transparent">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            subaccountId={subaccountId}
            pages={funnelPages.FunnelPages}
            funnelId={funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subaccountId={subaccountId}
            defaultData={funnelPages}
          />
        </TabsContent>
        <TabsContent value="products">
          <FunnelProductsTable defaultData={funnelPages} />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default FunnelPage;
