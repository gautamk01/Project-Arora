"use client";
import { Badge } from "@/components/ui/badge";
import { defaultStyle, EditorBtns } from "@/lib/constants";
import { useEditor } from "@/Provider/editor/editor-provider";
import { EditorElement } from "@/Provider/editor/editor-reducer";
import clsx from "clsx";
import React from "react";
import { v4 } from "uuid";
import { Trash } from "lucide-react";
import Recursive from "../recursive";

type Props = {
  element: EditorElement;
};

//Conainer component is a recursive container
//we are also planning feature like drag and drop things to the container
const Container = ({ element }: Props) => {
  const { id, content, name, style, type } = element;
  const { state, dispatch } = useEditor();

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as
      | EditorBtns
      | string;
    console.log(componentType);
    //when ever any eleemnt is drag and drop to a container we needed to add that element to that specific container
    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Element" },
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
              style: {
                ...defaultStyle,
              },
              type: "container",
            },
          },
        });
        break;
      case "link-element":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              ...state.editor.selectedElement,
              id: v4(),
            },
          },
        });
        break;
      case "link":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Link Element",
                href: "#",
              },
              id: v4(),
              name: "Link",
              style: {
                color: "white",
                ...defaultStyle,
              },
              type: "link",
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
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  style: { ...defaultStyle, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  style: { ...defaultStyle, width: "100%" },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Two Columns",
              style: { ...defaultStyle, display: "flex" },
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
  const handdleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type); //this is how we transfer the data into that event
    // when we drag an element we are passing a meta dat here "componentType"
    //when we are droping somwhere we can use getdata "componentType" handleOnDrop function we use that
  };

  //we are going to set the state that this is the element that we have selected
  const handleOnclickbody = (e: React.MouseEvent) => {
    e.stopPropagation(); //stopping propagation
    // we pass this element to the Change_clicked_element
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });

    if (!Array.isArray(state.editor.selectedElement.content)) {
      console.log(state.editor.selectedElement.content.href);
    }
    console.log(state.editor.selectedElement.content);
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
      style={style}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        " overflow-auto": type === "__body",
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
      //  onDragStart={(e) => handdleDragStart(e, "container")}
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
      {/* Return the Recursive Element  */}
      {/* if the content is an array  (which mean that there is an element inside the content ) */}
      {Array.isArray(content) &&
        content.map((childElement) => {
          return <Recursive key={childElement.id} element={childElement} />;
        })}

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

export default Container;
