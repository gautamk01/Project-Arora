import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import { useEditor } from "@/Provider/editor/editor-provider";
import { EditorElement } from "@/Provider/editor/editor-reducer";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { ReactEventHandler } from "react";

type Props = {
  element: EditorElement;
};

const VideoComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const handleDrageStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  const handleOnclick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };
  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const style = element.style;
  return (
    <div
      style={style}
      draggable
      onDragStart={(e) => handleDrageStart}
      onClick={handleOnclick}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
        {
          "!border-blue-500 !border-solid":
            state.editor.selectedElement.id === element.id, //this style will activate when you select the element
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode, //if it is not live mode this effect will show
        }
      )}
    >
      {/* Showing the small badge above the container with it's name */}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className=" absolute top-[23px] left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      {!Array.isArray(element.content) && (
        <iframe
          width={element.style.width || "560"}
          height={element.style.height || "315"}
          src={element.content.src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )}

      {/* Delete the container */}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className=" absolute bg-primary px-2.5 py-1 text-x font-bold top-[25x] right-[1px] rounded-none rounded-t-lg">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};

export default VideoComponent;
