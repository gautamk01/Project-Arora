import Video from "@/components/icons/video_recorder";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagesIcon, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";
import React from "react";
//shows all the tabs for the editor
type Props = {};

const TabList = (props: Props) => {
  return (
    <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Plus />
      </TabsTrigger>
      <TabsTrigger
        value="Layers"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <ImagesIcon />
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
