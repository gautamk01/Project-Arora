import React from "react";

import { Funnel, SubAccount } from "@prisma/client";
import { db } from "@/lib/db";

import FunnelForm from "@/components/form/funnel-form";
import FunnelProductsTable from "./funnel-product";

interface FunnelSettingsProps {
  subaccountId: string;
  defaultData: Funnel;
}

const FunnelSettings: React.FC<FunnelSettingsProps> = ({
  subaccountId,
  defaultData,
}) => {
  return (
    <div className="flex gap-4 flex-col xl:!flex-row">
      <FunnelForm subAccountId={subaccountId} defaultData={defaultData} />
    </div>
  );
};

export default FunnelSettings;
