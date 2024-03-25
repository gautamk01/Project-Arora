"use client";
import LaneForm from "@/components/form/lane-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  LaneDetail,
  PipelineDetailsWithLanesCardsTagsTickets,
} from "@/lib/type";
import { useModal } from "@/provider/modal-provider";
import { Lane, Ticket } from "@prisma/client";
import { Flag, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

type Props = {
  lanes: LaneDetail[];
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
};

const PipelineView = ({
  lanes,
  pipelineId,
  subaccountId,
  pipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
}: Props) => {
  const { setOpen } = useModal();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);
  const handleAddLane = () => {
    setOpen(
      <CustomModal
        title=" Create A Lane"
        subheading="Lanes allow you to group tickets"
      >
        {/* this is for creating the lanes in the pipeline */}
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>
    );
  };

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button className="flex items-center gap-4" onClick={handleAddLane}>
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
