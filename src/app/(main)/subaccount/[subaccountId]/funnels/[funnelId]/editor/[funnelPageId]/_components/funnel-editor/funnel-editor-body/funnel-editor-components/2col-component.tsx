"use client";
import React from "react";
import { v4 } from "uuid";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/Provider/editor/editor-provider";
import { EditorElement } from "@/Provider/editor/editor-reducer";
import { defaultStyle, EditorBtns } from "@/lib/constants";
import Recursive from "../recursive";
import ContainerEditor from "@/components/global/container-editor";
import { Trash } from "lucide-react";

type Props = {
  element: EditorElement;
};

const TwoColumns = ({ element }: Props) => {
  const { id, content, type } = element;
  const { dispatch, state } = useEditor();

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Component" },
              id: v4(),
              name: "Text",
              style: {
                color: "black",
                ...defaultStyle,
              },
              type: "text",
            },
          },
        });
        break;
      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Container",
              style: { ...defaultStyle },
              type: "container",
            },
          },
        });
        break;
      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Two Columns",
              style: { ...defaultStyle },
              type: "2Col",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };
  const handleDeleteContainer = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };
  return (
    <div
      style={element.style}
      className={clsx("relative p-4 transition-all", {
        "h-fit": type === "container",
        "h-full": type === "__body",
        "m-4": type === "container",
        "!border-blue-500":
          state.editor.selectedElement.id === element.id &&
          !state.editor.liveMode,
        "!border-solid":
          state.editor.selectedElement.id === element.id &&
          !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      id="innerContainer"
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
      {/* Delete the container */}
      {state.editor.selectedElement.id === id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className=" cursor-pointer absolute bg-primary px-2.5 py-1 text-x font-bold top-[25x] right-[1px] rounded-none rounded-t-lg">
            <Trash size={16} onClick={handleDeleteContainer} />
          </div>
        )}
    </div>
  );
};

export default TwoColumns;
