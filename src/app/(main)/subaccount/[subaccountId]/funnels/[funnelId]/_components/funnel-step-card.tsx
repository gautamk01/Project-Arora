import { Card, CardContent } from "@/components/ui/card";
import { FunnelPage } from "@prisma/client";
import { ArrowDown, Mail } from "lucide-react";
import React from "react";

type Props = {
  funnelPage: FunnelPage;
  index: number;
  activePage: boolean;
};

const FunnelStepCard = ({ activePage, funnelPage, index }: Props) => {
  return (
    <Card className="p-0 relative cursor-grab my-2">
      <CardContent className="p-0 flex items-center gap-4 flex-row">
        <div className="h-14 w-14 bg-muted flex items-center justify-center">
          <Mail />
          <ArrowDown size={18} className="absolute -bottom-2 text-primary" />
        </div>
        {funnelPage.name}
      </CardContent>
      {activePage && (
        <div className="w-2 top-2 right-2 h-2 absolute bg-emerald-500 rounded-full" />
      )}
    </Card>
  );
};

export default FunnelStepCard;
