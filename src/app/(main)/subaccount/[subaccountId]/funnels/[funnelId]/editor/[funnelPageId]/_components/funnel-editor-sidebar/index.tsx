"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/Provider/editor/editor-provider";
import clsx from "clsx";
//here we are going to build a skaliton for the sidebar
import React from "react";
import TabList from "./tabs";
import SettingTabs from "./tabs/settins-tab";
import MediaTab from "./tabs/media-tab";
import ComponentsTab from "./tabs/components-tab";

type Props = {
  subaccountId: string;
};

const FunnelEditorSidebar = ({ subaccountId }: Props) => {
  const { state, dispatch } = useEditor();
  return (
    <Sheet open={true} modal={false}>
      <Tabs className="w-full" defaultValue="Settings">
        {/* Sheet: List the Tabs */}
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "mt-[97px] w-16 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden",
            { hidden: state.editor.previewMode }
          )}
        >
          <TabList />
        </SheetContent>

        {/* Sheet: This is for render the contents for secific tabs */}
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden",
            { hidden: state.editor.previewMode }
          )}
        >
          <div className=" grid gap-4 h-full pb-36 overflow-scroll">
            <TabsContent value="Settings">
              <SheetHeader className=" text-left p-6">
                <SheetTitle>Style</SheetTitle>
                <SheetDescription>
                  Show your Creativity! you can customize every components as
                  you like
                </SheetDescription>
              </SheetHeader>
              <SettingTabs />
            </TabsContent>
            <TabsContent value="Media">
              <MediaTab subaccountId={subaccountId} />
            </TabsContent>
            <TabsContent value="Components">
              <SheetHeader className=" text-left p-6">
                <SheetTitle>Components </SheetTitle>
                <SheetDescription>
                  You can drag and drop components on you website-workspace
                </SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default FunnelEditorSidebar;
