import { EditorBtns } from "@/lib/constants";
import { TypeIcon } from "lucide-react";
import React from "react";

type Props = {};

const TextPlaceholder = (props: Props) => {
  const handleDrageStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    //when we drag and place to any component that has onDragDrop of Data : "componentType then the element will be Dropped "
    //from there we will extract the type
    //based on the type , we are going to update the editor state
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDrageStart(e, "text");
      }}
      className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <TypeIcon size={14} className="text-muted-foreground" />
    </div>
  );
};

export default TextPlaceholder;
