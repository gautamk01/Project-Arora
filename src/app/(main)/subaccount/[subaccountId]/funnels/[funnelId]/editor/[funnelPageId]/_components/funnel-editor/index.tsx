"use client";
import { Button } from "@/components/ui/button";
import { getFunnelPageDetails } from "@/lib/queries/funnelqueries";
import { useEditor } from "@/Provider/editor/editor-provider";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";
import Recursive from "./funnel-editor-body/recursive";

type Props = {
  funnelPageId: string;
  liveMode?: boolean;
};

//this act as the first element for the editor
//which is an recursive element
const FunnelEditor = ({ funnelPageId, liveMode }: Props) => {
  const { state, dispatch } = useEditor();

  //if we have pass live mode then we have to dispatch
  //we are going this because , when are render component in prodcution site
  //so that we have render the live mode , so that we can hide all other things
  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  //there is a performance issue that can be found in this section
  // when ever we are publish this website to the production site
  // that time it needed to fetch data from here
  //fix :: performance fix
  useEffect(() => {
    const fetchdata = async () => {
      const response = await getFunnelPageDetails(funnelPageId);
      if (!response) return;

      dispatch({
        type: "LOAD_DATA",
        payload: {
          elements: response.content ? JSON.parse(response?.content) : "",
          withLive: !!liveMode,
        },
      });
    };
    fetchdata();
  }, [funnelPageId]);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handleUnpreview = () => {
    dispatch({
      type: "TOGGLE_PREVIEW_MODE",
    });
    dispatch({
      type: "TOGGLE_LIVE_MODE",
    });
  };
  return (
    <div
      className={clsx(
        "use-automation-zoom-in overflow-scroll   mr-[385px] bg-background transition-all rounded-md",
        {
          "!p-0 !mr-0":
            state.editor.previewMode === true || state.editor.liveMode === true,
          "!w-[850px]": state.editor.device === "Tablet",
          "!w-[420px]": state.editor.device === "Mobile",
          "w-full": state.editor.device === "Desktop",
        }
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]"
          onClick={handleUnpreview}
        >
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
    </div>
  );
};

export default FunnelEditor;
