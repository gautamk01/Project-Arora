"use client";

import { useEditor } from "@/Provider/editor/editor-provider";
import { FunnelPage } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

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
  return <div>FunnelEditorNavigation</div>;
};

export default FunnelEditorNavigation;
