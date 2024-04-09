import { EditorBtns } from "@/lib/constants";
import { ContainerIcon } from "lucide-react";
import React from "react";

type Props = {};

const ContainerPlaceholder = (props: Props) => {
  const handleDrageStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDrageStart(e, "container");
      }}
      className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <div className="h-10 w-10 border-dashed border-[1px]  rounded-sm bg-muted-foreground/50 " />
    </div>
  );
};

export default ContainerPlaceholder;
