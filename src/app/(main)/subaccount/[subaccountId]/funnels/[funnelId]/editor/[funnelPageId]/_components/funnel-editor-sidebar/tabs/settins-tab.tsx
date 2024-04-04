"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEditor } from "@/Provider/editor/editor-provider";
import { TabsList } from "@radix-ui/react-tabs";
import {
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStartIcon,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
} from "lucide-react";
import React from "react";
import Tooltipwrapper from "../../tooltip";

type Props = {};

const clearnstring = (text?: any): string => {
  return text?.replace(/url\(["']?(.*?)["']?\)/gi, "$1");
};

const SettingTabs = (props: Props) => {
  const { state, dispatch } = useEditor();

  const handleChangeCustomValue = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const settingProperty = target.id; //getting the propery by the id
    let value = target.value; //getting the value from the input

    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  const handleOnChange = (
    e:
      | React.FormEvent<HTMLInputElement>
      | { target: { id: string; value: string } }
  ) => {
    const target = e.target as HTMLInputElement;
    const styleSettings = target.id;
    let value = target.value;

    if (styleSettings === "backgroundImage") {
      value = `url("${value}")`;

      console.log(value);
    }
    const styleObject = {
      [styleSettings]: value,
    };

    console.log(styleObject);
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          style: {
            ...state.editor.selectedElement.style,
            ...styleObject,
          },
        },
      },
    });
  };

  return (
    <TooltipProvider>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["Typography", "Dimensions", "Decorations", "Flexbox"]}
      >
        {/* LINK PATH */}
        <AccordionItem value="Custom" className="px-6 py-0">
          {/* AccordionTrigger point */}
          <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
          <AccordionContent>
            {/* if the selected Element is a link then if you wanted to change the Link path you can do that */}
            {state.editor.selectedElement.type === "link" &&
              !Array.isArray(state.editor.selectedElement.content) && (
                <div className=" flex flex-col gap-2">
                  <p className=" text-muted-foreground">Link path</p>
                  <Input
                    id="href"
                    placeholder="https:domain.example.com/pathname"
                    onChange={handleChangeCustomValue}
                    value={state.editor.selectedElement.content.href}
                  />
                </div>
              )}
          </AccordionContent>
        </AccordionItem>
        {/* TYPOGRAPHY */}
        <AccordionItem value="Typography" className=" px-6 py-0 border-y-[1px]">
          <AccordionTrigger className="!no-underline">
            Typography
          </AccordionTrigger>
          <AccordionContent className=" flex flex-col gap-2">
            {/* Color settings  */}
            <div className=" flex flex-col gap-2 px-1">
              <p className=" text-muted-foreground">Color</p>
              <Input
                id="color"
                onChange={handleOnChange}
                value={state.editor.selectedElement.style.color}
              />
            </div>
            {/* Opacity settings */}
            <div>
              <Label className="text-muted-foreground">Opacity</Label>
              <div className="flex items-center justify-end">
                <small className="p-2">
                  {typeof state.editor.selectedElement.style?.opacity ===
                  "number"
                    ? state.editor.selectedElement.style?.opacity
                    : parseFloat(
                        (
                          state.editor.selectedElement.style?.opacity || "0"
                        ).replace("%", "")
                      ) || 0}
                  %
                </small>
              </div>
              <Slider
                onValueChange={(e) => {
                  handleOnChange({
                    target: {
                      id: "opacity",
                      value: `${e[0]}%`,
                    },
                  });
                }}
                defaultValue={[
                  typeof state.editor.selectedElement.style?.opacity ===
                  "number"
                    ? state.editor.selectedElement.style?.opacity
                    : parseFloat(
                        (
                          state.editor.selectedElement.style?.opacity || "0"
                        ).replace("%", "")
                      ) || 0,
                ]}
                max={100}
                step={1}
              />
            </div>
            {/* Backgorund Image */}
            <div className=" flex flex-col gap-2 px-1">
              <p className=" text-muted-foreground ">Background Image</p>
              <div
                className="w-12 h-12 bg-slate-500  "
                style={{
                  backgroundImage:
                    state.editor.selectedElement.style.backgroundImage,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <Input
                placeholder="url()"
                className="!border-y-0 rounded-non !border-r-0"
                id="backgroundImage"
                onChange={handleOnChange}
                value={clearnstring(
                  state.editor.selectedElement.style.backgroundImage
                )}
              />
            </div>
            {/* Flex box - JustifyContent */}
            <Label className=" text-muted-foreground">Justify Content</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChange({ target: { id: "justifyContent", value: e } })
              }
              value={state.editor.selectedElement.style.justifyContent}
            >
              <TabsList className=" flex items-center flex-row justify-between border-[1px] rounded-lg bg-transparent h-fit gap-4">
                <Tooltipwrapper info="space-between">
                  <TabsTrigger
                    value="space-between"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignHorizontalSpaceBetween size={18} />
                  </TabsTrigger>
                </Tooltipwrapper>
                <Tooltipwrapper info="space-evenly">
                  <TabsTrigger
                    value="space-evenly"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignHorizontalSpaceAround size={18} />
                  </TabsTrigger>
                </Tooltipwrapper>
                <Tooltipwrapper info="center">
                  <TabsTrigger
                    value="center"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignHorizontalJustifyCenterIcon size={18} />
                  </TabsTrigger>
                </Tooltipwrapper>
                <Tooltipwrapper info="start">
                  <TabsTrigger
                    value="start"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignHorizontalJustifyStartIcon size={18} />
                  </TabsTrigger>
                </Tooltipwrapper>
                <Tooltipwrapper info="end">
                  <TabsTrigger
                    value="end"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignHorizontalJustifyEndIcon size={18} />
                  </TabsTrigger>
                </Tooltipwrapper>
              </TabsList>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default SettingTabs;
