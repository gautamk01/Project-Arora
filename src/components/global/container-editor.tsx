import { useEditor } from "@/Provider/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import { Badge } from "../ui/badge";
import { Trash } from "lucide-react";
import { EditorElement } from "@/Provider/editor/editor-reducer";
import { EditorBtns } from "@/lib/constants";

type Props = {
  style: React.CSSProperties;
  type: EditorBtns;
  id: string;
  element: EditorElement;
  children: React.ReactNode;
  handleOnclickbody: (e: React.MouseEvent) => void;
  handleDeleteContainer: () => void;
  handleOnDrop: (e: React.DragEvent, type: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handdleDragStart: (e: React.DragEvent, type: string) => void;
};

const ContainerEditor = ({
  style,
  type,
  element,
  handleDragOver,
  handdleDragStart,
  id,
  handleOnDrop,
  handleOnclickbody,
  handleDeleteContainer,
  children,
}: Props) => {
  const { state } = useEditor();
  return (
    <div
      style={style}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-scroll ": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnclickbody}
      onDragStart={(e) => handdleDragStart(e, "container")}
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden",
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>
      {children}
      {/* Delete the container */}
      {state.editor.selectedElement.id === id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className=" absolute bg-primary px-2.5 py-1 text-x font-bold top-[25x] right-[1px] rounded-none rounded-t-lg">
            <Trash size={16} onClick={handleDeleteContainer} />
          </div>
        )}
    </div>
  );
};

export default ContainerEditor;
