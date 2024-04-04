import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { Children } from "react";

type Props = {
  children: React.ReactNode;
  info: string;
};

const Tooltipwrapper = ({ children, info }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{info}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Tooltipwrapper;
