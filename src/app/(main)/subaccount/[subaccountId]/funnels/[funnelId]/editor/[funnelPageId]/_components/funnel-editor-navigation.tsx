"use client";

import { useEditor } from "@/Provider/editor/editor-provider";
import { FunnelPage } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  funnelId: string;
  funnelPageDetails: FunnelPage;
  subaccountId: string;
};

const FunnelEditorNavigation = ({
  funnelId,
  funnelPageDetails,
  subaccountId,
}: Props) => {
  const router = useRouter();
  const { state, dispatch } = useEditor();

  useEffect(() => {
    dispatch({
      type: "SET_FUNNELPAGE_ID",
      payload: { funnelPageId: funnelPageDetails.id },
    });
  });

  return <div>FunnelEditorNavigation</div>;
};

export default FunnelEditorNavigation;
