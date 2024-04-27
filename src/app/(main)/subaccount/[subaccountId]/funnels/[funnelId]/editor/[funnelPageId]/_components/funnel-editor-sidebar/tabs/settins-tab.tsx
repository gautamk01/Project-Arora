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
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyStartIcon,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  LucideImageDown,
} from "lucide-react";
import React from "react";
import Tooltipwrapper from "../../tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PercentageSlider from "./slider";

type Props = {};

const SettingTabs = (props: Props) => {
  const { state, dispatch } = useEditor(); //invoking the global stateManagement

  console.log(state.editor.selectedElement.style.opacity);
  //Handler to handle custom values
  const handleChangeCustomValues = (e: React.FormEvent<HTMLInputElement>) => {
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

  //Handler to handle all the tools
  const handleOnChanges = (
    e:
      | React.FormEvent<HTMLInputElement>
      | { target: { id: string; value: string } }
  ) => {
    const target = e.target as HTMLInputElement;
    const styleSettings = target.id;
    let value = target.value;

    if (styleSettings === "backgroundImage") {
      if (!value.endsWith(".jpg")) {
        console.log(state.editor.selectedElement.style.backgroundImage);
        const styleObject = {
          [styleSettings]: value,
        };

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
        console.log("Provided value does not have a .jpg extension. Aborting.");
        return;
      }
      value = `url("${value}")`;

      console.log(value);
    }

    const styleObject = {
      [styleSettings]: value,
    };
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
        {/* Custom Property settings will be show Here   */}
        <AccordionItem value="Custom" className="px-6 py-0  ">
          <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
          <AccordionContent>
            {state.editor.selectedElement.type === "link" &&
              !Array.isArray(state.editor.selectedElement.content) && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">Link Path</p>
                  <Input
                    id="href"
                    placeholder="https:domain.example.com/pathname"
                    onChange={handleChangeCustomValues}
                    value={state.editor.selectedElement.content.href}
                  />
                </div>
              )}
          </AccordionContent>
        </AccordionItem>

        {/* Typography Property settings will be show Here   */}
        <AccordionItem value="Typography" className="px-6 py-0  border-y-[1px]">
          <AccordionTrigger className="!no-underline">
            Typography
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 ">
            {/* Text Align Section  */}
            <div className="flex flex-col gap-2 ">
              <p className="text-muted-foreground">Text Align</p>
              <Tabs
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "textAlign",
                      value: e,
                    },
                  })
                }
                value={state.editor.selectedElement.style.textAlign}
              >
                <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                  <TabsTrigger
                    value="left"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignLeft size={18} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="right"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignRight size={18} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="center"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignCenter size={18} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="justify"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                  >
                    <AlignJustify size={18} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {/* Font Family section */}
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">Font Family</p>
              <Input
                id="DM Sans"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.style.fontFamily}
              />
            </div>
            {/* Color Section  */}
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">Color</p>
              <Input
                id="color"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.style.color}
              />
            </div>
            {/* font weight section */}
            <div className="flex gap-4">
              <div>
                <Label className="text-muted-foreground">Weight</Label>
                <Select
                  onValueChange={(e) =>
                    handleOnChanges({
                      target: {
                        id: "font-weight",
                        value: e,
                      },
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Font Weights</SelectLabel>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="normal">Regular</SelectItem>
                      <SelectItem value="lighter">Light</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-muted-foreground">Size</Label>
                <Input
                  placeholder="px"
                  id="fontSize"
                  onChange={handleOnChanges}
                  value={state.editor.selectedElement.style.fontSize}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dimensions Property settings will be show Here */}
        <AccordionItem value="Dimensions" className="px-6 py-0">
          <AccordionTrigger className="!no-underline">
            Dimensions
          </AccordionTrigger>
          <AccordionContent>
            {/* Section for inputting width and height */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {/* Height and width section  */}
                <div className=" p-2 ">
                  <p className=" pb-3">Height & width</p>
                  <div className="flex gap-4 flex-col">
                    <div className="flex gap-4">
                      {/* Height input section */}
                      <div>
                        <Label className="text-muted-foreground">Height</Label>
                        <Input
                          id="height"
                          placeholder="px"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.height || ""
                          }
                        />
                      </div>
                      {/* Width input section */}
                      <div>
                        <Label className="text-muted-foreground">Width</Label>
                        <Input
                          placeholder="px"
                          id="width"
                          onChange={handleOnChanges}
                          value={state.editor.selectedElement.style.width || ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Margin settings section */}
                <div className="p-2">
                  <p className="pb-2">Margin px</p>
                  <div className="flex gap-4 flex-col">
                    <div className="flex gap-4">
                      {/* Margin top input section */}
                      <div>
                        <Label className="text-muted-foreground">Top</Label>
                        <Input
                          id="marginTop"
                          placeholder="px"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.marginTop || ""
                          }
                        />
                      </div>
                      {/* Margin bottom input section */}
                      <div>
                        <Label className="text-muted-foreground">Bottom</Label>
                        <Input
                          placeholder="px"
                          id="marginBottom"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.marginBottom ||
                            ""
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {/* Margin left input section */}
                      <div>
                        <Label className="text-muted-foreground">Left</Label>
                        <Input
                          placeholder="px"
                          id="marginLeft"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.marginLeft || ""
                          }
                        />
                      </div>
                      {/* Margin right input section */}
                      <div>
                        <Label className="text-muted-foreground">Right</Label>
                        <Input
                          placeholder="px"
                          id="marginRight"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.marginRight || ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Padding settings section */}
                <div className=" p-2">
                  <p className=" pb-2">Padding px</p>
                  <div className="flex gap-4 flex-col">
                    <div className="flex gap-4">
                      {/* Padding top input section */}
                      <div>
                        <Label className="text-muted-foreground">Top</Label>
                        <Input
                          placeholder="px"
                          id="paddingTop"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.paddingTop || ""
                          }
                        />
                      </div>
                      {/* Padding bottom input section */}
                      <div>
                        <Label className="text-muted-foreground">Bottom</Label>
                        <Input
                          placeholder="px"
                          id="paddingBottom"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.paddingBottom ||
                            ""
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {/* Padding left input section */}
                      <div>
                        <Label className="text-muted-foreground">Left</Label>
                        <Input
                          placeholder="px"
                          id="paddingLeft"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.paddingLeft || ""
                          }
                        />
                      </div>
                      {/* Padding right input section */}
                      <div>
                        <Label className="text-muted-foreground">Right</Label>
                        <Input
                          placeholder="px"
                          id="paddingRight"
                          onChange={handleOnChanges}
                          value={
                            state.editor.selectedElement.style.paddingRight ||
                            ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Decorations Property settings will be shown Here */}
        <AccordionItem value="Decorations" className="px-6 py-0">
          <AccordionTrigger className="!no-underline">
            Decorations
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {/* Opacity setting section */}
            <div className="p-2">
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

              <PercentageSlider
                defaultValue={state.editor.selectedElement.style?.opacity}
                onValueChange={(e: any) => {
                  handleOnChanges({
                    target: {
                      id: "opacity",
                      value: e.target.value, // Correctly accessing the value from the event object
                    },
                  });
                }}
              />
            </div>
            {/* Border radius setting section */}
            <div>
              <Label className="text-muted-foreground">Border Radius</Label>
              <div className="flex items-center justify-end">
                <small className="">
                  {typeof state.editor.selectedElement.style?.borderRadius ===
                  "number"
                    ? state.editor.selectedElement.style?.borderRadius
                    : parseFloat(
                        (
                          state.editor.selectedElement.style?.borderRadius ||
                          "0"
                        ).replace("px", "")
                      ) || 0}
                  px
                </small>
              </div>
              <Slider
                onValueChange={(e) => {
                  handleOnChanges({
                    target: {
                      id: "borderRadius",
                      value: `${e[0]}px`,
                    },
                  });
                }}
                defaultValue={[
                  typeof state.editor.selectedElement.style?.borderRadius ===
                  "number"
                    ? state.editor.selectedElement.style?.borderRadius
                    : parseFloat(
                        (
                          state.editor.selectedElement.style?.borderRadius ||
                          "0"
                        ).replace("%", "")
                      ) || 0,
                ]}
                max={100}
                step={1}
              />
            </div>
            {/* Background color input section */}
            <div className="flex flex-col gap-2 p-2">
              <Label className="text-muted-foreground">Background Color</Label>
              <div className="flex border-[1px] rounded-md overflow-clip">
                <div
                  className="w-12 "
                  style={{
                    backgroundColor:
                      state.editor.selectedElement.style.backgroundColor,
                  }}
                />
                <Input
                  placeholder="#HFI245"
                  className="!border-y-0 rounded-none !border-r-0 mr-2"
                  id="backgroundColor"
                  onChange={handleOnChanges}
                  value={
                    state.editor.selectedElement.style.backgroundColor || ""
                  }
                />
              </div>
            </div>
            {/* Background image input section */}
            <div className="flex flex-col gap-2 p-2">
              <Label className="text-muted-foreground">Background Image</Label>
              <div className="flex border-[1px] rounded-md overflow-clip">
                <div
                  className="w-12 "
                  style={{
                    backgroundImage:
                      state.editor.selectedElement.style.backgroundImage,
                  }}
                />
                <Input
                  placeholder="url()"
                  className="!border-y-0 rounded-none !border-r-0 mr-2"
                  id="backgroundImage"
                  onChange={handleOnChanges}
                  value={
                    state.editor.selectedElement.style.backgroundImage || ""
                  }
                />
              </div>
            </div>
            {/* Image position setting section */}
            <div className="flex flex-col gap-2 p-2">
              <Label className="text-muted-foreground">Image Position</Label>
              <Tabs
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "backgroundSize",
                      value: e,
                    },
                  })
                }
                value={state.editor.selectedElement.style.backgroundSize?.toString()}
              >
                <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                  <TabsTrigger
                    value="cover"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <ChevronsLeftRightIcon size={18} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="contain"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <AlignVerticalJustifyCenter size={22} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="auto"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <LucideImageDown size={18} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Flexbox Property settings will be shown Here */}
        <AccordionItem value="Flexbox" className="px-6 py-0">
          <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
          <AccordionContent>
            {/* Justify content setting section */}
            <Label className="text-muted-foreground">Justify Content</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "justifyContent",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.style.justifyContent}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="space-between"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignHorizontalSpaceBetween size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="space-evenly"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignHorizontalSpaceAround size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="center"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignHorizontalJustifyCenterIcon size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="start"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignHorizontalJustifyStart size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="end"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignHorizontalJustifyEndIcon size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Align items setting section */}
            <Label className="text-muted-foreground">Align Items</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "alignItems",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.style.alignItems}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="center"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignVerticalJustifyCenter size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="normal"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignVerticalJustifyStart size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Flex display toggle section */}
            <div className="flex items-center gap-2">
              <Input
                className="h-4 w-4"
                placeholder="px"
                type="checkbox"
                id="display"
                onChange={(va) => {
                  handleOnChanges({
                    target: {
                      id: "display",
                      value: va.target.checked ? "flex" : "block",
                    },
                  });
                }}
              />
              <Label className="text-muted-foreground">Flex</Label>
            </div>
            {/* Flex direction input section */}
            <div>
              <Label className="text-muted-foreground">Direction</Label>
              <Input
                placeholder="px"
                id="flexDirection"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.style.flexDirection || ""}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default SettingTabs;
