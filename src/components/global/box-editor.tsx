import { useEditor } from "@/Provider/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import { Badge } from "../ui/badge";
import { Trash } from "lucide-react";
import { EditorElement } from "@/Provider/editor/editor-reducer";

type Props = {
  children: React.ReactNode;
  element: EditorElement;
  style: React.CSSProperties;
  handleOnClickBody: (e: React.MouseEvent) => void;
  handleDeleteElement: () => void;
};

const BoxEditor = ({
  children,
  element,
  style,
  handleOnClickBody,
  handleDeleteElement,
}: Props) => {
  const { state } = useEditor();
  return (
    <div
      style={style}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
        {
          "!border-blue-600 !border-solid":
            state.editor.selectedElement.id === element.id, //this style will activate when you select the element
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode, //if it is not live mode this effect will show
        }
      )}
      onClick={handleOnClickBody}
    >
      {/* Showing the small badge above the container with it's name */}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className=" absolute top-[23px] left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {children}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className=" absolute bg-primary px-2.5 py-1 text-xs font-bold top-[25px] right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className=" cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default BoxEditor;
