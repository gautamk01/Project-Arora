import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorBtns } from "@/lib/constants";
import React from "react";
import TextPlaceholder from "./text-placeholder";
import ContainerPlaceholder from "./Container-placeholder";
import VideoPlaceholder from "./video-placeholder";
import LinkPlaceholder from "./link-placeholder";
import TwoColumnsPlaceholder from "./2col-placeholder";

type Props = {};

const ComponentsTab = (props: Props) => {
  // This component mainly focuse on the element for the website builder which can easily drag and drop to the work space
  //consiste of mainy widget
  const elements: {
    Component: React.ReactNode;
    label: string;
    id: EditorBtns;
    group: "layout" | "elements";
  }[] = [
    {
      Component: <TextPlaceholder />,
      label: "Text",
      id: "text",
      group: "elements",
    },
    {
      Component: <ContainerPlaceholder />,
      label: "Container",
      id: "container",
      group: "layout",
    },
    {
      Component: <VideoPlaceholder />,
      label: "video",
      id: "video",
      group: "elements",
    },
    {
      Component: <LinkPlaceholder />,
      label: "Link",
      id: "link",
      group: "elements",
    },
    {
      Component: <TwoColumnsPlaceholder />,
      label: "2 Columns",
      id: "2Col",
      group: "layout",
    },
  ];

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["Layout", "Elements"]}
    >
      {/* Layout section  */}
      <AccordionItem value="Layout" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
        <AccordionContent className=" flex flex-wrap gap-2">
          {/* filter the layout element then pass that value and itrate by map show the component and it's label */}
          {elements
            .filter((element) => element.group === "layout")
            .map((element) => (
              <div
                key={element.id}
                className=" flex-col items-center justify-center flex "
              >
                {element.Component}
                <span className=" text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      {/* Elements Section  */}
      <AccordionItem value="Elements" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">Elements </AccordionTrigger>
        <AccordionContent className=" flex flex-wrap gap-2">
          {/* filter the elements then pass that value and itrate by map show the component and it's label */}
          {elements
            .filter((element) => element.group === "elements")
            .map((element) => (
              <div
                key={element.id}
                className=" flex-col items-center justify-center flex "
              >
                {element.Component}
                <span className=" text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ComponentsTab;
