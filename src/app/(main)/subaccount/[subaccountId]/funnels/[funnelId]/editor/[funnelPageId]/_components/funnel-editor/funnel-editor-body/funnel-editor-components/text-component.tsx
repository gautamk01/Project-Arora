"use client";

import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/Provider/editor/editor-provider";
import { EditorElement } from "@/Provider/editor/editor-reducer";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const TextComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const style = element.style;
  const handleOnClickBody = (e: React.MouseEvent) => {
    //these element are within each other
    //so because of event bubbling so this event may activate to the body
    //to avoid that issue we are doing stopPropagation
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    //we are not adding the drag and drop here
    //Fix : Drag and drop
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
      {/* span to delete the selected element  */}
      <span
        suppressContentEditableWarning={true}
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement;
          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          });
        }}
      >
        {/* Note: THis component only deals with static component , because it is text component */}
        {!Array.isArray(element.content) && element.content.innerText}
      </span>
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

export default TextComponent;
