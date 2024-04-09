import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import EditorProvider from "@/Provider/editor/editor-provider";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import FunnelEditor from "./_components/funnel-editor";

type Props = {
  params: {
    subaccountId: string;
    funnelId: string;
    funnelPageId: string;
  };
};

const Page = async ({ params }: Props) => {
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId,
    },
  });
  if (!funnelPageDetails) {
    return redirect(
      `/subaccount/${params.subaccountId}/funnels/${params.funnelPageId}`
    );
  }
  return (
    <div className=" fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={params.subaccountId}
        funnelId={params.funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          subaccountId={params.subaccountId}
          funnelPageDetails={funnelPageDetails}
        />
        <div className=" h-full flex justify-center">
          {/* workspace for the website Builder */}
          <FunnelEditor funnelPageId={params.funnelPageId} />
        </div>
        <FunnelEditorSidebar subaccountId={params.subaccountId} />
      </EditorProvider>
    </div>
  );
};

export default Page;
