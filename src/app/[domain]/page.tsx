import { db } from "@/lib/db";

import { notFound } from "next/navigation";
import React from "react";
import FunnelEditorNavigation from "../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor-navigation";
import FunnelEditor from "../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import EditorProvider from "@/Provider/editor/editor-provider";
import { getDomainContent } from "@/lib/queries/funnelqueries";

const Page = async ({ params }: { params: { domain: string } }) => {
  //params.domain.slice(0, -1) => name of the
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  if (!domainData) return notFound(); //If the domain desnot exsiste of if you type  a wrong domain then it will redirect to the not found section

  const pageData = domainData.FunnelPages.find((page) => !page.pathName); // find the page that desnot have a path name
  if (!pageData) return notFound();
  //if not found then redirect to not found section

  // we wanted to increament the number of vist to the page , as the people some
  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Page;
